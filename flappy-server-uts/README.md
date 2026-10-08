# 🎮 FLAPPY BIRD RETRO-ARCADE 16395 // UTS 2026

![PHP](https://img.shields.io/badge/PHP-8.x-777BB4?style=for-the-badge&logo=php&logoColor=white)
![MariaDB](https://img.shields.io/badge/MariaDB-MySQLi_OOP-003545?style=for-the-badge&logo=mariadb&logoColor=white)
![HTML5 Canvas](https://img.shields.io/badge/HTML5-Canvas_2D-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3 Synthwave](https://img.shields.io/badge/Style-Synthwave_Arcade-ff2e97?style=for-the-badge)
![Multi-Agent](https://img.shields.io/badge/Vibe_Coding-Multi--Agent-00f3ff?style=for-the-badge)

Game **Flappy Bird Retro-Arcade Modern** berbasis web dengan integrasi server database MariaDB/MySQL, deteksi tabrakan AABB prosedural murni (*zero external image assets*), dan antarmuka visual Synthwave 80s yang responsif.

Proyek ini dibangun menggunakan paradigma **Collaborative Multi-Agent Vibe Coding** dengan batasan akses file (*permission boundaries*) yang ketat antar model AI.

---

## 🏛️ Arsitektur & Struktur Direktori

```text
flappy-server-uts/
├── schema.sql           # Database schema, user DDL, & dummy data awal (Gemini 3.1 Pro)
├── backend.php          # Koneksi MySQLi OOP, anti-SQL injection, & REST API (Gemini 3.1 Pro)
├── game.js              # HTML5 Canvas 2D engine, fisika flappy, & tabrakan AABB (Gemini 3.8 Flash)
├── bridge.js            # Jembatan interaksi event Game Over & Modal UI
├── style.css            # Desain Synthwave Retro-Arcade, neon glow & CRT scanlines (Claude Opus 5.5)
├── index.php            # Master entry point, server-side render & DOM assembler (Claude Opus 5.5)
└── AGENTS.md            # Kontrak hak akses & protokol kolaborasi multi-agent
```

---

## 🤖 Multi-Agent Collaboration Matrix

| Model AI | Peran / Domain | Tanggung Jawab | File yang Dikelola |
| :--- | :--- | :--- | :--- |
| **Gemini 3.1 Pro** | Database & Backend Architect | Skema DDL MariaDB, Prepared Statements (Anti-SQL Injection), REST API Endpoint | `schema.sql`, `backend.php` |
| **Gemini 3.8 Flash** | Game Engine & Physics Dev | Render Canvas 360x540 prosedural, gravitasi, kontrol lompat, pipa acak, tabrakan AABB | `game.js` |
| **Claude Opus 5.5** | UI/UX Designer & Master Assembler | Visual Synthwave 80s, animasi CRT & 3D grid, modal glassmorphism, perakitan akhir | `style.css`, `index.php` |

---

## 🚀 Panduan Menjalankan Proyek

1. **Import Database:** Import `schema.sql` via phpMyAdmin (`http://localhost/phpmyadmin`).
2. **Jalankan Web Server:**
   ```bash
   php -S localhost:8000
   ```
3. Buka browser: `http://localhost:8000`
