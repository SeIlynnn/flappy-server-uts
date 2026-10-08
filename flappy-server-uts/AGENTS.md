# 🛡️ Multi-Agent Boundary & Permission Contract
**Project:** `flappy-server-uts`  
**Paradigm:** Collaborative Multi-Agent Vibe Coding  

---

## 1. Matrix Hak Akses (Permission Matrix)

| Agent Model | Role / Peran | File yang Boleh Diedit (READ / WRITE) | File Terlarang (READ ONLY / NO TOUCH) |
| :--- | :--- | :--- | :--- |
| **Gemini 3.1 Pro** | Database & Backend Architect | `schema.sql`<br>`backend.php` | ❌ `game.js`<br>❌ `style.css`<br>❌ `index.php` |
| **Gemini 3.8 Flash** | Game Engine & Physics Dev | `game.js` | ❌ `schema.sql`<br>❌ `backend.php`<br>❌ `style.css`<br>❌ `index.php` |
| **Claude Opus 5.5** | UI/UX Designer & Master Assembler | `style.css`<br>`index.php` | ❌ `schema.sql`<br>❌ `backend.php`<br>❌ `game.js` *(hanya panggil via DOM/Global)* |

---

## 2. API & DOM Interface Contracts (PENTING!)

### A. Kontrak Backend (`backend.php`) ↔ Game Engine (`game.js`)
* **Endpoint 1:** `GET backend.php?action=get_leaderboard`
  * **Response:**
    ```json
    {
      "status": "success",
      "data": [
        { "id": 1, "player_name": "ACE", "score": 45, "played_at": "08-10-2026 12:00" }
      ]
    }
    ```
* **Endpoint 2:** `POST backend.php?action=save_score`
  * **Content-Type:** `application/json`
  * **Payload:** `{ "player_name": "ACE", "score": 45 }`
  * **Response:**
    ```json
    {
      "status": "success",
      "message": "Skor berhasil disimpan!",
      "new_id": 10,
      "rank": 1
    }
    ```

### B. Kontrak DOM (`index.php`) ↔ Game Engine (`game.js`)
* Canvas ID: `<canvas id="gameCanvas" width="360" height="640"></canvas>`
* Score UI: `#currentScore` (tampilan skor saat main)
* High Score UI: `#highScoreDisplay`
* Leaderboard Container: `#leaderboardList`
* Game Over Modal: `#gameOverModal`
* Form Input Nama: `#playerNameInput` dan `#submitScoreBtn`
* Start / Restart Button: `#restartBtn`
* Feedback Text: `#submitFeedback`

---

## 3. Prompt Directive untuk Setiap Agent (Copy-Paste Ready)

### 📌 Prompt untuk Gemini 3.1 Pro (Backend & Database)
```text
Kamu bertindak sebagai Backend & Database Architect untuk proyek flappy-server-uts.
Izin Akses File:
- BOLEH UBAH: schema.sql, backend.php
- DILARANG SENTUH: game.js, style.css, index.php

Tanggung Jawab:
1. Pastikan schema.sql membuat database MySQL/MariaDB dengan tabel scores (id, player_name, score, created_at).
2. Di backend.php, gunakan PDO dengan prepared statements untuk mencegah SQL Injection.
3. Sediakan 2 aksi REST JSON: action=get_leaderboard (Top 10 DESC) dan action=save_score (POST JSON).
4. Berikan output selalu berupa header application/json dengan format { status: "success"|"error", ... }.
```

### 📌 Prompt untuk Gemini 3.8 Flash (Game Logic & Physics)
```text
Kamu bertindak sebagai Game Engine Developer untuk proyek flappy-server-uts.
Izin Akses File:
- BOLEH UBAH: game.js
- DILARANG SENTUH: schema.sql, backend.php, style.css, index.php

Tanggung Jawab:
1. Tulis logic Flappy Bird berbasis HTML5 Canvas 2D (burung, gravitasi, lompat, pipa atas/bawah acak, sistem skor, tabrakan).
2. Dukung kontrol: Tombol Spasi, ArrowUp, dan Touch / Click layar.
3. Integrasikan fetch() ke backend.php sesuai kontrak:
   - Ambil Top 10 dari backend.php?action=get_leaderboard dan render ke #leaderboardList.
   - Kirim skor saat game over ke backend.php?action=save_score.
4. Gunakan ID elemen DOM yang telah ditentukan (#gameCanvas, #currentScore, #gameOverModal, dll).
```

### 📌 Prompt untuk Claude Opus 5.5 (Styling & Master Entry Point)
```text
Kamu bertindak sebagai Lead Frontend UI/UX & Master Assembler untuk proyek flappy-server-uts.
Izin Akses File:
- BOLEH UBAH: style.css, index.php
- DILARANG SENTUH: schema.sql, backend.php, game.js (hanya import dan hubungkan via elemen DOM)

Tanggung Jawab:
1. index.php: Buat struktur web responsif, rapi, memuat Google Fonts (misal 'Press Start 2P' / retro arcade), me-render canvas game, modal Game Over, serta panel Leaderboard Top 10.
2. style.css: Berikan visual Modern Retro-Arcade / Synthwave yang memukau (neon glow, sleek dark background, tombol arcade beranimasi, glassmorphism leaderboard card).
3. Pastikan ID elemen sesuai dengan yang dibutuhkan oleh game.js.
```
