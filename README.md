# Smart Daily Khata

Mobile-first daily accounting app for shop income, expenses, and profit tracking.

## Stack

- React 18 + Vite
- Tailwind CSS
- React Router DOM
- Zustand
- React Hook Form + Zod
- PHP API
- MySQL
- Day.js with `Asia/Karachi`
- PWA via Vite PWA

## Data Model

MySQL tables are defined in:

```txt
api/schema.sql
```

Main tables:

```txt
users
transactions
```

## Setup

1. Install frontend dependencies:

```bash
npm install
```

2. Create the MySQL database:

```bash
mysql -u root -p < api/schema.sql
```

3. Create backend config:

```bash
copy api\config.example.php api\config.php
```

Then edit `api/config.php` with your MySQL username/password.

4. Start the PHP API:

```bash
php -S 127.0.0.1:8000 -t api api/index.php
```

5. Start the React app:

```bash
npm run dev -- --port 5175
```

Open:

```txt
http://localhost:5175
```

Vite proxies `/api/*` to `http://127.0.0.1:8000`.

## API

```txt
GET    /api/auth/me
POST   /api/auth/signup
POST   /api/auth/login
POST   /api/auth/logout
GET    /api/transactions
POST   /api/transactions
PUT    /api/transactions/{id}
DELETE /api/transactions/{id}
GET    /api/transactions/range?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD
```

## Build

```bash
npm run build
```
