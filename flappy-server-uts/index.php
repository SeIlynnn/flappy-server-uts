<?php
/**
 * =========================================================================
 * FILE: index.php
 * AREA KHUSUS: Claude Opus 5.5 (Master Entry Point & Master Assembler)
 * DILARANG DIUBAH OLEH AGENT LAIN!
 * Proyek  : FLAPPY BIRD ARCADE 16395  |  Domain: 16395.local
 * =========================================================================
 */

// Muat data awal dari backend jika tersedia
require_once __DIR__ . '/backend.php';
?>
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>FLAPPY BIRD ARCADE 16395 // UTS 2026</title>
    <meta name="description" content="Game Flappy Bird Retro-Arcade Modern dengan Leaderboard MariaDB Server (16395.local)">

    <!-- Google Fonts: Inter, Press Start 2P, Silkscreen -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&family=Press+Start+2P&family=Silkscreen:wght@400;700&display=swap" rel="stylesheet">
    
    <!-- Stylesheet Desain Modern Synthwave Retro-Arcade (Area Claude Opus 5.5) -->
    <link rel="stylesheet" href="style.css">
</head>
<body>

    <!-- Latar Belakang Synthwave Prosedural (Bintang, Matahari, Grid 3D) -->
    <div class="bg" aria-hidden="true">
        <div class="bg-stars"></div>
        <div class="bg-sun"></div>
        <div class="bg-grid"></div>
    </div>

    <!-- Overlay Efek CRT Scanline Retro -->
    <div class="crt-overlay" aria-hidden="true"></div>

    <!-- Wrapper Aplikasi Utama -->
    <div class="app">

        <!-- Header Navigasi & Metadata -->
        <header class="site-header">
            <div class="topbar">
                <ul class="meta-badge">
                    <li class="meta-item">
                        <span class="meta-icon">🎮</span>
                        <span class="meta-key">TUGAS:</span>
                        <span class="meta-val">UTS 2026</span>
                    </li>
                    <li class="meta-item is-name">
                        <span class="meta-icon">👤</span>
                        <span class="meta-key">KODE:</span>
                        <span class="meta-val">16395</span>
                    </li>
                    <li class="meta-item">
                        <span class="meta-icon">🌐</span>
                        <span class="meta-key">SERVER:</span>
                        <span class="meta-val">16395.local</span>
                    </li>
                </ul>

                <!-- Status Pill MariaDB -->
                <div class="status-pill <?= $db_connected ? 'is-online' : 'is-offline' ?>" title="<?= htmlspecialchars($db_status_msg, ENT_QUOTES, 'UTF-8') ?>">
                    <span class="status-dot"></span>
                    <span><?= $db_connected ? 'DB ONLINE' : 'DB OFFLINE' ?></span>
                    <span class="status-sub"><?= $db_connected ? 'MariaDB' : 'Error' ?></span>
                </div>
            </div>

            <div class="title">
                <h1 class="title-main">FLAPPY BIRD</h1>
                <div class="title-sub">ARCADE <span class="title-code">16395</span> EDITION</div>
                <p class="tagline">TEKAN <kbd>SPACE</kbd> ATAU TAP LAYAR UNTUK MENGEPAKKAN SAYAP</p>
            </div>
        </header>

        <!-- Arena Permainan (Layout 2 Kolom Sejajar di Desktop) -->
        <main class="arena">
            
            <!-- Kabinet Arcade (Canvas Game) -->
            <section class="cabinet" aria-label="Area Game Canvas">
                <div class="marquee">
                    <span class="marquee-star">★</span>
                    FLAPPY CYBER ARCADE
                    <span class="marquee-star">★</span>
                </div>

                <!-- Heads-Up Display (HUD) Skor Saat Main -->
                <div class="hud">
                    <div class="hud-box">
                        <span class="hud-label">SKOR</span>
                        <span id="currentScore" class="hud-val">0</span>
                    </div>
                    <div class="hud-center">SIAP TERBANG</div>
                    <div class="hud-box is-hi">
                        <span class="hud-label">TERTINGGI</span>
                        <span id="highScoreDisplay" class="hud-val">0</span>
                    </div>
                </div>

                <!-- Layar Monitor CRT Canvas (360x540) -->
                <div class="screen">
                    <canvas id="gameCanvas" width="360" height="540"></canvas>
                </div>

                <!-- Petunjuk Kontrol -->
                <div class="controls-hint">
                    <span>KONTROL:</span>
                    <span class="key-tag">SPACE</span>
                    <span>/</span>
                    <span class="key-tag">KLIK MOUSE</span>
                    <span>/</span>
                    <span class="key-tag">LAYAR SENTUH</span>
                </div>
            </section>

            <!-- Panel Leaderboard Glassmorphism -->
            <aside class="board" aria-label="Papan Peringkat Top 10">
                <div class="board-head">
                    <div>
                        <h2 class="board-title">⚡ TOP 10 <span class="accent">PILOT</span></h2>
                        <p class="board-sub">Papan skor global MariaDB</p>
                    </div>
                    <span class="live-chip <?= $db_connected ? '' : 'is-off' ?>"><?= $db_connected ? 'LIVE SYNC' : 'OFFLINE' ?></span>
                </div>

                <!-- Kartu Statistik Ringkas -->
                <div class="stats">
                    <div class="stat is-gold">
                        <span class="stat-label">REKOR NO.1</span>
                        <span class="stat-val" id="statTopScore"><?= !empty($top_scores) ? (int)$top_scores[0]['score'] : '0' ?></span>
                    </div>
                    <div class="stat">
                        <span class="stat-label">PILOT NO.1</span>
                        <span class="stat-val" id="statTopPilot"><?= !empty($top_scores) ? htmlspecialchars(mb_substr($top_scores[0]['player_name'], 0, 7), ENT_QUOTES, 'UTF-8') : '-' ?></span>
                    </div>
                    <div class="stat is-pink">
                        <span class="stat-label">TOTAL DATA</span>
                        <span class="stat-val" id="statTotal"><?= count($top_scores) ?></span>
                    </div>
                </div>

                <!-- Tabel Skor Peringkat (Grid 4 Kolom) -->
                <div class="lb-table">
                    <div class="lb-head">
                        <span>RANK</span>
                        <span>PILOT</span>
                        <span class="score-col">SKOR</span>
                        <span class="date-col">WAKTU</span>
                    </div>

                    <ul id="leaderboardList" class="leaderboard-list">
                        <?php if (empty($top_scores)): ?>
                            <li class="empty-state">Belum ada skor tercatat. Jadilah yang pertama!</li>
                        <?php else: ?>
                            <?php foreach ($top_scores as $idx => $item): ?>
                                <?php 
                                    $rankNum = $idx + 1;
                                    $rankClass = $rankNum === 1 ? 'rank-1' : ($rankNum === 2 ? 'rank-2' : ($rankNum === 3 ? 'rank-3' : ''));
                                    $badge = $rankNum === 1 ? '1ST' : ($rankNum === 2 ? '2ND' : ($rankNum === 3 ? '3RD' : '#' . $rankNum));
                                    $createdTime = !empty($item['created_at']) ? date('d/m/Y H:i', strtotime($item['created_at'])) : '-';
                                ?>
                                <li class="leaderboard-item <?= $rankClass ?>" style="--i: <?= $idx ?>">
                                    <span class="rank-col">
                                        <span class="rank-badge"><?= $badge ?></span>
                                    </span>
                                    <span class="name-col">
                                        <?php if ($rankNum === 1): ?><span class="crown">👑</span><?php endif; ?>
                                        <span class="name-text"><?= htmlspecialchars($item['player_name'], ENT_QUOTES, 'UTF-8') ?></span>
                                    </span>
                                    <span class="score-col"><?= (int)$item['score'] ?></span>
                                    <span class="date-col"><small><?= $createdTime ?></small></span>
                                </li>
                            <?php endforeach; ?>
                        <?php endif; ?>
                    </ul>
                </div>

                <div class="board-foot">
                    <span>DATABASE: <strong>db_16395.leaderboard</strong></span>
                    <span>REST API: <strong>backend.php</strong></span>
                </div>
            </aside>

        </main>

        <!-- Footer -->
        <footer class="site-footer">
            <span>FLAPPY BIRD ARCADE 16395</span>
            <span class="sep">//</span>
            <span>PEMROGRAMAN WEB UTS 2026</span>
            <span class="sep">//</span>
            <span>MULTI-AGENT VIBE CODING</span>
        </footer>

    </div>

    <!-- Modal Game Over (Glassmorphism & Neon Glitch) -->
    <div id="gameOverModal" class="modal-overlay hidden" role="dialog" aria-modal="true" aria-labelledby="gameOverTitle">
        <div class="modal-card">
            <span class="modal-kicker">MISSION FAILED</span>
            <h2 id="gameOverTitle" class="game-over-title" data-text="GAME OVER">GAME OVER</h2>
            
            <div class="final-score-box">
                <span class="final-label">SKOR AKHIR KAMU</span>
                <span id="finalScoreDisplay" class="final-score-val">0</span>
                <div id="rankPreview" class="rank-preview"></div>
            </div>

            <form class="score-form" onsubmit="event.preventDefault();">
                <div class="field-label">
                    <label for="playerNameInput">NAMA / CALLSIGN</label>
                    <span class="counter" id="charCounter">0/15</span>
                </div>

                <input type="hidden" id="inputFinalScore" name="score" value="0">
                <input 
                    type="text" 
                    id="playerNameInput" 
                    name="player_name" 
                    class="arcade-input" 
                    placeholder="PILOT_ACE" 
                    maxlength="15" 
                    autocomplete="off" 
                    required
                >

                <div class="btn-row">
                    <button type="button" id="submitScoreBtn" class="arcade-btn primary">SIMPAN SKOR</button>
                    <button type="button" id="btnRestart" class="arcade-btn secondary">MAIN LAGI</button>
                </div>

                <p id="submitFeedback" class="feedback-msg" aria-live="polite"></p>
                <p class="modal-hint">TEKAN ENTER UNTUK SIMPAN // ESC UNTUK ULANG</p>
            </form>
        </div>
    </div>

    <!-- 1. Core Game Engine (Canvas 360x540 Prosedural) -->
    <script src="game.js"></script>

    <!-- 2. UI Interaction Bridge Script -->
    <script src="bridge.js"></script>

    <!-- 3. Integrasi Interaktif Frontend & REST API backend.php -->
    <script>
        document.addEventListener('DOMContentLoaded', function () {
            const listEl = document.getElementById('leaderboardList');
            const nameInput = document.getElementById('playerNameInput');
            const submitBtn = document.getElementById('submitScoreBtn');
            const feedbackEl = document.getElementById('submitFeedback');
            const charCounter = document.getElementById('charCounter');
            const modal = document.getElementById('gameOverModal');
            const modalCard = modal ? modal.querySelector('.modal-card') : null;

            // Karakter counter input nama
            if (nameInput && charCounter) {
                nameInput.addEventListener('input', function () {
                    charCounter.textContent = `${this.value.length}/15`;
                });
            }

            // Keyboard shortcut pada modal Game Over (Enter to Submit, Esc to Restart)
            window.addEventListener('keydown', function (e) {
                if (!modal || modal.classList.contains('hidden')) return;

                if (e.key === 'Enter') {
                    e.preventDefault();
                    if (submitBtn && !submitBtn.disabled) submitBtn.click();
                } else if (e.key === 'Escape') {
                    const btnRestart = document.getElementById('btnRestart');
                    if (btnRestart) btnRestart.click();
                }
            });

            // Fungsi render tabel leaderboard (4 kolom sinkron dengan style.css Claude Opus)
            window.refreshLeaderboard = async function () {
                if (!listEl) return;
                try {
                    const res = await fetch('backend.php?action=get_leaderboard');
                    const json = await res.json();

                    if (json.status === 'success' && Array.isArray(json.data)) {
                        if (json.data.length === 0) {
                            listEl.innerHTML = '<li class="empty-state">Belum ada skor tercatat. Jadilah yang pertama!</li>';
                            return;
                        }

                        // Perbarui stats ringkas
                        const topScoreEl = document.getElementById('statTopScore');
                        const topPilotEl = document.getElementById('statTopPilot');
                        const totalEl = document.getElementById('statTotal');
                        if (topScoreEl) topScoreEl.textContent = json.data[0].score;
                        if (topPilotEl) topPilotEl.textContent = json.data[0].player_name.slice(0, 7);
                        if (totalEl) totalEl.textContent = json.data.length;

                        listEl.innerHTML = json.data.map((item, idx) => {
                            const rankNum = idx + 1;
                            const rankClass = rankNum === 1 ? 'rank-1' : (rankNum === 2 ? 'rank-2' : (rankNum === 3 ? 'rank-3' : ''));
                            const badge = rankNum === 1 ? '1ST' : (rankNum === 2 ? '2ND' : (rankNum === 3 ? '3RD' : '#' + rankNum));
                            const dateStr = item.created_at ? item.created_at.replace(/-/g, '/').slice(0, 16) : '-';

                            return `
                                <li class="leaderboard-item ${rankClass}" style="--i: ${idx}">
                                    <span class="rank-col">
                                        <span class="rank-badge">${badge}</span>
                                    </span>
                                    <span class="name-col">
                                        ${rankNum === 1 ? '<span class="crown">👑</span>' : ''}
                                        <span class="name-text">${escapeHtml(item.player_name)}</span>
                                    </span>
                                    <span class="score-col">${item.score}</span>
                                    <span class="date-col"><small>${dateStr}</small></span>
                                </li>
                            `;
                        }).join('');
                    } else if (listEl.children.length === 0 || listEl.querySelector('.empty-state')) {
                        listEl.innerHTML = `<li class="lb-state is-error">⚠️ ${escapeHtml(json.message || 'Database offline. Nyalakan MariaDB di XAMPP!')}</li>`;
                    }
                } catch (err) {
                    console.error("Gagal sinkron leaderboard:", err);
                    if (listEl.children.length === 0 || listEl.querySelector('.empty-state')) {
                        listEl.innerHTML = '<li class="lb-state is-error">⚠️ Server offline. Nyalakan MariaDB di XAMPP!</li>';
                    }
                }
            };

            // Handler tombol submit skor
            if (submitBtn) {
                submitBtn.addEventListener('click', async function () {
                    const name = nameInput ? nameInput.value.trim() : '';
                    const scoreVal = parseInt(document.getElementById('inputFinalScore')?.value || '0', 10);

                    if (!name) {
                        if (feedbackEl) {
                            feedbackEl.className = 'feedback-msg is-error';
                            feedbackEl.textContent = 'Nama pemain wajib diisi!';
                        }
                        if (modalCard) {
                            modalCard.classList.add('is-shake');
                            setTimeout(() => modalCard.classList.remove('is-shake'), 450);
                        }
                        if (nameInput) nameInput.focus();
                        return;
                    }

                    submitBtn.disabled = true;
                    if (feedbackEl) {
                        feedbackEl.className = 'feedback-msg is-loading';
                        feedbackEl.textContent = 'Menyimpan ke MariaDB...';
                    }

                    try {
                        const res = await fetch('backend.php?action=save_score', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ player_name: name, score: scoreVal })
                        });

                        const json = await res.json();

                        if (json.status === 'success') {
                            if (feedbackEl) {
                                feedbackEl.className = 'feedback-msg is-success';
                                feedbackEl.textContent = '🎉 Skor berhasil masuk papan peringkat!';
                            }
                            if (modalCard) modalCard.classList.add('is-celebrate');

                            // Refresh tabel skor
                            await window.refreshLeaderboard();

                            // Tutup modal dan reset game otomatis setelah 1 detik
                            setTimeout(() => {
                                if (modal) {
                                    modal.classList.add('hidden');
                                    modal.style.display = 'none';
                                }
                                submitBtn.disabled = false;
                                if (modalCard) modalCard.classList.remove('is-celebrate');
                                if (feedbackEl) feedbackEl.textContent = '';
                                if (typeof window.resetGame === 'function') window.resetGame();
                            }, 1100);
                        } else {
                            if (feedbackEl) {
                                feedbackEl.className = 'feedback-msg is-error';
                                feedbackEl.textContent = json.message || 'Gagal menyimpan skor.';
                            }
                            submitBtn.disabled = false;
                        }
                    } catch (err) {
                        console.error('Submit error:', err);
                        if (feedbackEl) {
                            feedbackEl.className = 'feedback-msg is-error';
                            feedbackEl.textContent = 'Koneksi database terputus!';
                        }
                        submitBtn.disabled = false;
                    }
                });
            }

            function escapeHtml(str) {
                const p = document.createElement('p');
                p.textContent = str;
                return p.innerHTML;
            }

            // Muat dan sinkronkan data papan peringkat saat halaman selesai dimuat
            window.refreshLeaderboard();
        });
    </script>
</body>
</html>
