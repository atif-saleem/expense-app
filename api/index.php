<?php

declare(strict_types=1);

require __DIR__ . '/bootstrap.php';

$method = $_SERVER['REQUEST_METHOD'];
$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$path = '/' . trim((string) $path, '/');
$parts = array_values(array_filter(explode('/', trim($path, '/'))));

try {
    if ($parts === ['auth', 'me'] && $method === 'GET') {
        send_json(['user' => current_user()]);
    }

    if ($parts === ['auth', 'signup'] && $method === 'POST') {
        $data = json_input();
        $name = require_string($data, 'name', 120);
        $email = strtolower(require_string($data, 'email', 190));
        $password = (string) ($data['password'] ?? '');

        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            fail('Enter a valid email.', 422);
        }
        if (strlen($password) < 6) {
            fail('Password must be at least 6 characters.', 422);
        }

        $stmt = db()->prepare('INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)');
        try {
            $stmt->execute([$name, $email, password_hash($password, PASSWORD_DEFAULT)]);
        } catch (PDOException $error) {
            if ($error->getCode() === '23000') {
                fail('This email is already registered. Please login instead.', 409);
            }
            throw $error;
        }

        $_SESSION['user_id'] = (int) db()->lastInsertId();
        send_json(['user' => current_user()], 201);
    }

    if ($parts === ['auth', 'login'] && $method === 'POST') {
        $data = json_input();
        $email = strtolower(require_string($data, 'email', 190));
        $password = (string) ($data['password'] ?? '');

        $stmt = db()->prepare('SELECT id, name, email, password_hash FROM users WHERE email = ? LIMIT 1');
        $stmt->execute([$email]);
        $row = $stmt->fetch();

        if (!$row || !password_verify($password, $row['password_hash'])) {
            fail('Invalid email or password.', 401);
        }

        $_SESSION['user_id'] = (int) $row['id'];
        send_json(['user' => public_user($row)]);
    }

    if ($parts === ['auth', 'logout'] && $method === 'POST') {
        $_SESSION = [];
        if (ini_get('session.use_cookies')) {
            $params = session_get_cookie_params();
            setcookie(session_name(), '', time() - 42000, $params['path'], $params['domain'] ?? '', (bool) $params['secure'], (bool) $params['httponly']);
        }
        session_destroy();
        send_json(['ok' => true]);
    }

    if ($parts === ['transactions'] && $method === 'GET') {
        $userId = current_user_id();
        $limit = max(1, min(100, (int) ($_GET['limit'] ?? 25)));
        $offset = max(0, (int) ($_GET['offset'] ?? 0));
        $where = ['user_id = ?'];
        $values = [$userId];

        if (!empty($_GET['type']) && in_array($_GET['type'], ['income', 'expense'], true)) {
            $where[] = 'type = ?';
            $values[] = $_GET['type'];
        }
        if (!empty($_GET['date'])) {
            $where[] = 'entry_date = ?';
            $values[] = $_GET['date'];
        }
        if (!empty($_GET['month'])) {
            $where[] = 'entry_month = ?';
            $values[] = $_GET['month'];
        }

        $sql = 'SELECT * FROM transactions WHERE ' . implode(' AND ', $where) . ' ORDER BY created_at DESC, id DESC LIMIT ' . ($limit + 1) . ' OFFSET ' . $offset;
        $stmt = db()->prepare($sql);
        $stmt->execute($values);
        $rows = $stmt->fetchAll();
        $hasMore = count($rows) > $limit;
        $rows = array_slice($rows, 0, $limit);

        send_json([
            'rows' => array_map('transaction_response', $rows),
            'cursor' => $offset + count($rows),
            'hasMore' => $hasMore,
        ]);
    }

    if ($parts === ['transactions', 'range'] && $method === 'GET') {
        $userId = current_user_id();
        $startDate = require_string($_GET, 'startDate', 10);
        $endDate = require_string($_GET, 'endDate', 10);
        $stmt = db()->prepare('SELECT * FROM transactions WHERE user_id = ? AND entry_date >= ? AND entry_date <= ? ORDER BY entry_date DESC, id DESC');
        $stmt->execute([$userId, $startDate, $endDate]);
        send_json(['rows' => array_map('transaction_response', $stmt->fetchAll())]);
    }

    if ($parts === ['transactions'] && $method === 'POST') {
        $userId = current_user_id();
        $transaction = validate_transaction(json_input());
        $stmt = db()->prepare(
            'INSERT INTO transactions (user_id, type, title, amount, note, entry_date, entry_month, entry_year, timezone)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)'
        );
        $stmt->execute([
            $userId,
            $transaction['type'],
            $transaction['title'],
            $transaction['amount'],
            $transaction['note'],
            $transaction['entry_date'],
            $transaction['entry_month'],
            $transaction['entry_year'],
            $transaction['timezone'],
        ]);

        $stmt = db()->prepare('SELECT * FROM transactions WHERE id = ? AND user_id = ?');
        $stmt->execute([(int) db()->lastInsertId(), $userId]);
        send_json(['transaction' => transaction_response($stmt->fetch())], 201);
    }

    if ($parts === ['transactions', 'batch'] && $method === 'POST') {
        $userId = current_user_id();
        $data = json_input();
        $items = is_array($data['items'] ?? null) ? $data['items'] : [];
        if (!$items) {
            fail('No transactions provided.', 422);
        }

        $stmt = db()->prepare(
            'INSERT INTO transactions (user_id, type, title, amount, note, entry_date, entry_month, entry_year, timezone)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)'
        );

        db()->beginTransaction();
        foreach ($items as $item) {
            $transaction = validate_transaction($item);
            $stmt->execute([
                $userId,
                $transaction['type'],
                $transaction['title'],
                $transaction['amount'],
                $transaction['note'],
                $transaction['entry_date'],
                $transaction['entry_month'],
                $transaction['entry_year'],
                $transaction['timezone'],
            ]);
        }
        db()->commit();

        send_json(['ok' => true], 201);
    }

    if (count($parts) === 2 && $parts[0] === 'transactions' && ctype_digit($parts[1]) && $method === 'PUT') {
        $userId = current_user_id();
        $transactionId = (int) $parts[1];
        $transaction = validate_transaction(json_input());
        $stmt = db()->prepare(
            'UPDATE transactions
             SET type = ?, title = ?, amount = ?, note = ?, entry_date = ?, entry_month = ?, entry_year = ?, timezone = ?, updated_at = CURRENT_TIMESTAMP
             WHERE id = ? AND user_id = ?'
        );
        $stmt->execute([
            $transaction['type'],
            $transaction['title'],
            $transaction['amount'],
            $transaction['note'],
            $transaction['entry_date'],
            $transaction['entry_month'],
            $transaction['entry_year'],
            $transaction['timezone'],
            $transactionId,
            $userId,
        ]);

        if ($stmt->rowCount() === 0) {
            fail('Transaction not found.', 404);
        }

        send_json(['ok' => true]);
    }

    if (count($parts) === 2 && $parts[0] === 'transactions' && ctype_digit($parts[1]) && $method === 'DELETE') {
        $userId = current_user_id();
        $stmt = db()->prepare('DELETE FROM transactions WHERE id = ? AND user_id = ?');
        $stmt->execute([(int) $parts[1], $userId]);
        send_json(['ok' => true]);
    }

    fail('API route not found.', 404);
} catch (PDOException $error) {
    fail('Database error: ' . $error->getMessage(), 500);
} catch (Throwable $error) {
    fail($error->getMessage(), 500);
}
