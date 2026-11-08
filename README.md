# Flappy Bird Retro-Arcade 16395 - UTS Pemrograman Web 2026

Aplikasi permainan web Flappy Bird modern bertema retro-arcade synthwave dengan backend PHP dan database MariaDB/MySQL untuk pencatatan skor leaderboard secara real-time.

---

## Struktur Direktori

```text
flappy-server-uts/
├── schema.sql           # Skema database MariaDB, user DDL, dan data awal
├── backend.php          # Koneksi database MySQLi OOP, validasi input, dan REST API
├── game.js              # Game engine Canvas 2D, kalkulasi fisika, dan deteksi tabrakan
├── bridge.js            # Penghubung event game engine dengan antarmuka modal
├── style.css            # Penggayaan visual retro synthwave arcade
└── index.php            # Halaman utama game dan integrasi antarmuka
```

---

## Fitur Utama

1. **Rendering Prosedural HTML5 Canvas:**
   Seluruh elemen visual (burung, pipa rintangan, animasi kepakan, latar bintang, dan lantai bergerak) dirender menggunakan Canvas 2D API tanpa aset gambar eksternal.

2. **Leaderboard Terintegrasi:**
   Papan skor Top 10 tersinkronisasi langsung dengan database MariaDB melalui endpoint REST API.

3. **Backend Aman:**
   Menggunakan MySQLi dengan prepared statements untuk mencegah ancaman SQL Injection, dilengkapi validasi tipe data dan sanitasi input nama pemain.

4. **Multi-Input Kontrol:**
   Dukungan kontrol menggunakan tombol Play pada antarmuka, tombol Spacebar, tombol panah atas (ArrowUp), klik mouse, dan layar sentuh (touchscreen) pada perangkat mobile/tablet.

5. **Kompatibilitas Lintas Browser:**
   Dioptimalkan untuk Chrome, Mozilla Firefox, Edge, dan browser modern lainnya dengan penanganan event terisolasi untuk mencegah perilaku scrolling halaman yang tidak disengaja.

---

## Persyaratan Sistem

- PHP 7.4 atau lebih baru (PHP 8.x direkomendasikan)
- Ekstensi PHP: `mysqli`
- Database Server: MariaDB atau MySQL
- Web Server: Apache (XAMPP / Laragon) atau PHP Built-in Web Server
- Web Browser modern (Firefox, Chrome, Edge, Safari)

---

## Panduan Instalasi dan Menjalankan

### 1. Konfigurasi Database

1. Buka phpMyAdmin (`http://localhost/phpmyadmin`) atau terminal MySQL/MariaDB.
2. Impor file skema database:
   ```text
   flappy-server-uts/schema.sql
   ```
3. File skema akan membuat database `db_16395`, akun database `user_16395` (password: `password123`), tabel `leaderboard`, serta data dummy skor awal.

### 2. Menjalankan Server

#### Menggunakan PHP Built-in Server:
Jalankan perintah berikut melalui terminal atau PowerShell di dalam folder proyek:
```bash
php -S localhost:8000 -t flappy-server-uts
```
Akses melalui peramban: `http://localhost:8000`

#### Menggunakan XAMPP:
1. Tempatkan folder proyek ke dalam direktori `htdocs` XAMPP:
   ```text
   C:\xampp\htdocs\flappy-server-uts\
   ```
2. Pastikan service Apache dan MySQL sudah berjalan pada XAMPP Control Panel.
3. Akses melalui peramban:
   ```text
   http://localhost/flappy-server-uts/flappy-server-uts/
   ```

---

## Spesifikasi REST API (`backend.php`)

### 1. Ambil Data Leaderboard
- **Metode:** `GET`
- **Endpoint:** `backend.php?action=get_leaderboard`
- **Format Respon:** JSON
- **Contoh Respon:**
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

### 2. Simpan Skor Pemain
- **Metode:** `POST`
- **Endpoint:** `backend.php?action=save_score`
- **Header:** `Content-Type: application/json`
- **Payload:**
  ```json
  {
    "player_name": "PILOT_ACE",
    "score": 45
  }
  ```
- **Contoh Respon:**
  ```json
  {
    "status": "success",
    "message": "Skor berhasil disimpan!",
    "id": 11,
    "player_name": "PILOT_ACE",
    "score": 45
  }
  ```

---

## Lisensi

Proyek ini dibuat untuk keperluan evaluasi Ujian Tengah Semester (UTS) Pemrograman Web 2026 dan dirilis di bawah lisensi MIT.
