CREATE DATABASE IF NOT EXISTS smart_daily_khata
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE smart_daily_khata;

CREATE TABLE IF NOT EXISTS users (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(190) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS transactions (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id INT UNSIGNED NOT NULL,
  type ENUM('income', 'expense') NOT NULL,
  title VARCHAR(80) NOT NULL,
  amount DECIMAL(12, 2) NOT NULL,
  note VARCHAR(240) NOT NULL DEFAULT '',
  entry_date DATE NOT NULL,
  entry_month CHAR(7) NOT NULL,
  entry_year SMALLINT UNSIGNED NOT NULL,
  timezone VARCHAR(64) NOT NULL DEFAULT 'Asia/Karachi',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_transactions_user_created (user_id, created_at),
  INDEX idx_transactions_user_type_created (user_id, type, created_at),
  INDEX idx_transactions_user_date_created (user_id, entry_date, created_at),
  INDEX idx_transactions_user_month_created (user_id, entry_month, created_at),
  CONSTRAINT fk_transactions_user
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
