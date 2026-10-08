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

## ✨ Fitur Utama

1. **Grafis Prosedural Tanpa Aset Gambar:**
   - Seluruh grafis (burung pixel, animasi kepakan sayap, pipa arcade, latar bintang & lantai) digambar murni via JavaScript Canvas 2D API.
2. **Keamanan & Robustness Backend:**
   - Query parameterized menggunakan **MySQLi Prepared Statements** untuk mencegah eksploitasi SQL Injection.
   - Dilengkapi fallback otomatis ke user default `root` XAMPP jika user `user_16395` belum dikonfigurasi di server lokal.
3. **Papan Skor Top 10 Interaktif:**
   - Sinkronisasi instan via `fetch()` REST JSON endpoint (`action=get_leaderboard` & `action=save_score`).
   - Tampilan podium khusus: Emas (*1st*), Perak (*2nd*), dan Perunggu (*3rd*).
4. **Visual Modern Synthwave 80s:**
   - Lapisan scanline monitor tabung retro (*CRT Overlay*).
   - Animasi 3D perspective grid bergerak di horizon bawah.
   - Tipografi retro pixel menggunakan Google Fonts (`Press Start 2P`, `Silkscreen`, `Inter`).
5. **Dukungan Multi-Kontrol:**
   - Keyboard: `Spacebar` / `ArrowUp`
   - Mouse: Klik kiri layar canvas
   - Smartphone / Tablet: Sentuhan layar sentuh (*touch events*)

---

## 🚀 Panduan Menjalankan Proyek

### 1. Prasyarat
* XAMPP / Laragon (Apache & MariaDB/MySQL)
* PHP versi 7.4 atau lebih baru (PHP 8.x direkomendasikan)
* Browser modern (Chrome, Edge, Firefox, Safari)

### 2. Setup Database
1. Buka **phpMyAdmin** (`http://localhost/phpmyadmin`).
2. Buat database baru bernama `db_16395`, atau langsung import file:
   ```text
   flappy-server-uts/schema.sql
   ```
3. File `schema.sql` akan otomatis membuat tabel `leaderboard`, user `user_16395`, serta 10 data skor dummy awal.

### 3. Menjalankan Server Lokal

#### Opsi A: Menggunakan XAMPP
Pindahkan folder `FlappyBird` ke dalam direktori `C:\xampp\htdocs\`, lalu akses di browser:
```text
http://localhost/FlappyBird/flappy-server-uts/
```

#### Opsi B: Menggunakan PHP Built-in Server
Buka terminal / PowerShell di folder proyek dan jalankan:
```bash
# Melalui PHP di PATH:
php -S localhost:8000 -t flappy-server-uts

# Atau menggunakan binary XAMPP langsung:
C:\xampp\php\php.exe -S localhost:8000 -t flappy-server-uts
```
Buka browser dan kunjungi: **`http://localhost:8000`**

---

## 📜 Spesifikasi REST API (`backend.php`)

### 1. Ambil Leaderboard Top 10
* **Request:** `GET backend.php?action=get_leaderboard`
* **Response:**
  ```json
  {
    "status": "success",
    "data": [
      {
        "id": 1,
        "player_name": "CYBER_PILOT",
        "score": 98,
        "created_at": "2026-10-08 12:00:00"
      }
    ]
  }
  ```

### 2. Simpan Skor Pemain Baru
* **Request:** `POST backend.php?action=save_score`
* **Headers:** `Content-Type: application/json`
* **Payload:**
  ```json
  {
    "player_name": "ACE_PILOT",
    "score": 45
  }
  ```
* **Response:**
  ```json
  {
    "status": "success",
    "message": "Skor berhasil disimpan!",
    "id": 11,
    "player_name": "ACE_PILOT",
    "score": 45
  }
  ```

---

## 👨‍💻 Kontributor & Lisensi
Dikembangkan untuk evaluasi **Ujian Tengah Semester (UTS) Pemrograman Web 2026** — Domain `16395.local`.  
Lisensi: **MIT License**.
