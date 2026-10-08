-- =========================================================================
-- FILE: schema.sql
-- Database DDL & Data Dummy untuk Proyek Flappy Bird (domain: 16395.local)
-- Database: db_16395 | Tabel: leaderboard
-- =========================================================================

-- 1. Buat Database jika belum ada
CREATE DATABASE IF NOT EXISTS db_16395 CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE db_16395;

-- 2. Buat User Khusus jika belum ada (sesuai spesifikasi koneksi backend.php)
CREATE USER IF NOT EXISTS 'user_16395'@'localhost' IDENTIFIED BY 'password123';
GRANT ALL PRIVILEGES ON db_16395.* TO 'user_16395'@'localhost';
FLUSH PRIVILEGES;

-- 3. Buat Tabel Leaderboard
DROP TABLE IF EXISTS leaderboard;

CREATE TABLE leaderboard (
    id INT AUTO_INCREMENT PRIMARY KEY,
    player_name VARCHAR(50) NOT NULL,
    score INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_leaderboard_score (score DESC, created_at ASC)
) ENGINE=InnoDB;

-- 3. Data Dummy Skor Awal (Top 10)
INSERT INTO leaderboard (player_name, score, created_at) VALUES
('CYBER_PILOT', 98, NOW() - INTERVAL 10 DAY),
('PIXEL_KING',  84, NOW() - INTERVAL 9 DAY),
('RETRO_ACE',   75, NOW() - INTERVAL 8 DAY),
('NEON_GIRL',   63, NOW() - INTERVAL 7 DAY),
('ARCADE_HERO', 52, NOW() - INTERVAL 6 DAY),
('FLAPPY_PRO',  45, NOW() - INTERVAL 5 DAY),
('BYTE_RUNNER', 37, NOW() - INTERVAL 4 DAY),
('ZERO_DEATH',  28, NOW() - INTERVAL 3 DAY),
('VIBE_CODER',  19, NOW() - INTERVAL 2 DAY),
('NEW_CHALLENGER', 10, NOW() - INTERVAL 1 DAY);
