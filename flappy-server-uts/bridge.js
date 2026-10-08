/**
 * =========================================================================
 * FILE: bridge.js
 * UI Interaction Bridge (Menghubungkan Core Game Engine & DOM Modal UI)
 * =========================================================================
 */

(function () {
    'use strict';

    /**
     * 1. Handler Global Game Over
     * Dipanggil otomatis oleh game engine (game.js) ketika burung mati/menabrak.
     * @param {number} finalScore - Skor akhir perolehan pemain.
     */
    window.handleGameOver = function (finalScore) {
        // Tampilkan skor pada elemen span #finalScoreDisplay (dengan fallback #finalScore)
        const finalScoreDisplay = document.getElementById('finalScoreDisplay') || document.getElementById('finalScore');
        if (finalScoreDisplay) {
            finalScoreDisplay.textContent = finalScore;
        }

        // Isi nilai skor ke input hidden #inputFinalScore untuk kebutuhan form submit
        const inputFinalScore = document.getElementById('inputFinalScore');
        if (inputFinalScore) {
            inputFinalScore.value = finalScore;
        }

        // Tampilkan modal game over (#gameOverModal)
        const gameOverModal = document.getElementById('gameOverModal');
        if (gameOverModal) {
            gameOverModal.classList.remove('hidden');
            gameOverModal.style.display = 'flex';
            gameOverModal.setAttribute('aria-hidden', 'false');
        }

        // Tampilkan motivasi / preview rank pada #rankPreview jika tersedia
        const rankPreview = document.getElementById('rankPreview');
        if (rankPreview) {
            if (finalScore >= 50) {
                rankPreview.className = 'rank-preview is-top';
                rankPreview.textContent = '🔥 SKOR DEWA! KANDIDAT JUARA 1';
            } else if (finalScore >= 20) {
                rankPreview.className = 'rank-preview is-top';
                rankPreview.textContent = '⚡ SKOR TINGGI! BERPOTENSI TOP 10';
            } else if (finalScore >= 5) {
                rankPreview.className = 'rank-preview';
                rankPreview.textContent = '👍 TERBANG BAGUS! SIMPAN SKORMU';
            } else {
                rankPreview.className = 'rank-preview';
                rankPreview.textContent = 'AYO COBA LAGI UNTUK SKOR LEBIH TINGGI!';
            }
        }

        // Auto-focus ke input nama jika tersedia
        const playerNameInput = document.getElementById('playerNameInput') || document.querySelector('input[name="player_name"]');
        if (playerNameInput) {
            playerNameInput.focus();
        }
    };

    /**
     * 2. Inisialisasi Event Listener Tombol Restart
     */
    document.addEventListener('DOMContentLoaded', function () {
        // Mendukung selector #btnRestart (dan fallback #restartBtn)
        const btnRestart = document.getElementById('btnRestart') || document.getElementById('restartBtn');
        const gameOverModal = document.getElementById('gameOverModal');

        if (btnRestart) {
            btnRestart.addEventListener('click', function () {
                // Sembunyikan modal game over
                if (gameOverModal) {
                    gameOverModal.classList.add('hidden');
                    gameOverModal.style.display = 'none';
                    gameOverModal.setAttribute('aria-hidden', 'true');
                }

                // Bersihkan pesan notifikasi / error submit jika ada
                const feedbackEl = document.getElementById('submitFeedback');
                if (feedbackEl) {
                    feedbackEl.textContent = '';
                }

                // Panggil fungsi reset game dari game.js untuk mulai main lagi
                if (typeof window.resetGame === 'function') {
                    window.resetGame();
                } else {
                    console.warn("Fungsi window.resetGame() tidak ditemukan di game.js");
                }
            });
        }
    });

})();
