<?php

declare(strict_types=1);

session_name('khata_session');
session_set_cookie_params([
    'lifetime' => 60 * 60 * 24 * 30,
    'path' => '/',
    'httponly' => true,
    'samesite' => 'Lax',
]);
session_start();

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

function config(): array
{
    static $config = null;
    if ($config !== null) {
        return $config;
    }

    $path = __DIR__ . '/config.php';
    $config = file_exists($path) ? require $path : require __DIR__ . '/config.example.php';
    return $config;
}

function db(): PDO
{
    static $pdo = null;
    if ($pdo instanceof PDO) {
        return $pdo;
    }

    $config = config();
    $dsn = sprintf(
        'mysql:host=%s;dbname=%s;charset=%s',
        $config['db_host'],
        $config['db_name'],
        $config['db_charset']
    );

    $pdo = new PDO($dsn, $config['db_user'], $config['db_pass'], [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
    ]);

    return $pdo;
}

function json_input(): array
{
    $raw = file_get_contents('php://input');
    if ($raw === '' || $raw === false) {
        return [];
    }

    $data = json_decode($raw, true);
    if (!is_array($data)) {
        fail('Invalid JSON body.', 400);
    }

    return $data;
}

function send_json($data, int $status = 200): void
{
    http_response_code($status);
    echo json_encode($data);
    exit;
}

function fail(string $message, int $status = 400): void
{
    send_json(['error' => $message], $status);
}

function current_user_id(): int
{
    if (empty($_SESSION['user_id'])) {
        fail('Please log in again.', 401);
    }

    return (int) $_SESSION['user_id'];
}

function public_user(array $row): array
{
    return [
        'uid' => (string) $row['id'],
        'id' => (int) $row['id'],
        'displayName' => $row['name'],
        'email' => $row['email'],
    ];
}

function current_user(): ?array
{
    if (empty($_SESSION['user_id'])) {
        return null;
    }

    $stmt = db()->prepare('SELECT id, name, email FROM users WHERE id = ? LIMIT 1');
    $stmt->execute([(int) $_SESSION['user_id']]);
    $row = $stmt->fetch();

    return $row ? public_user($row) : null;
}

function require_string(array $data, string $key, int $max = 255): string
{
    $value = trim((string) ($data[$key] ?? ''));
    if ($value === '') {
        fail(ucfirst($key) . ' is required.', 422);
    }
    if (mb_strlen($value) > $max) {
        fail(ucfirst($key) . ' is too long.', 422);
    }
    return $value;
}

function transaction_response(array $row): array
{
    return [
        'id' => (string) $row['id'],
        'userId' => (string) $row['user_id'],
        'type' => $row['type'],
        'title' => $row['title'],
        'amount' => (float) $row['amount'],
        'note' => $row['note'],
        'date' => $row['entry_date'],
        'month' => $row['entry_month'],
        'year' => (int) $row['entry_year'],
        'timezone' => $row['timezone'],
        'createdAt' => $row['created_at'],
        'updatedAt' => $row['updated_at'],
    ];
}

function validate_transaction(array $data): array
{
    $type = (string) ($data['type'] ?? '');
    if (!in_array($type, ['income', 'expense'], true)) {
        fail('Transaction type must be income or expense.', 422);
    }

    $title = require_string($data, 'title', 80);
    $amount = (float) ($data['amount'] ?? 0);
    if ($amount <= 0) {
        fail('Amount must be greater than 0.', 422);
    }

    $date = require_string($data, 'date', 10);
    $parsedDate = DateTime::createFromFormat('Y-m-d', $date);
    if (!$parsedDate || $parsedDate->format('Y-m-d') !== $date) {
        fail('Date must use YYYY-MM-DD format.', 422);
    }

    $note = trim((string) ($data['note'] ?? ''));
    if (mb_strlen($note) > 240) {
        fail('Note is too long.', 422);
    }

    return [
        'type' => $type,
        'title' => $title,
        'amount' => $amount,
        'note' => $note,
        'entry_date' => $date,
        'entry_month' => substr($date, 0, 7),
        'entry_year' => (int) substr($date, 0, 4),
        'timezone' => 'Asia/Karachi',
    ];
}
