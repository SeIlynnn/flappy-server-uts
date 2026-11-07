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
        const finalScoreDisplay = document.getElementById('finalScoreDisplay') || document.getElementById('finalScore');
        if (finalScoreDisplay) {
            finalScoreDisplay.textContent = finalScore;
        }

        const inputFinalScore = document.getElementById('inputFinalScore');
        if (inputFinalScore) {
            inputFinalScore.value = finalScore;
        }

        const gameOverModal = document.getElementById('gameOverModal');
        if (gameOverModal) {
            gameOverModal.classList.remove('hidden');
            gameOverModal.style.display = 'flex';
            gameOverModal.setAttribute('aria-hidden', 'false');
        }

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

        const playerNameInput = document.getElementById('playerNameInput') || document.querySelector('input[name="player_name"]');
        if (playerNameInput) {
            setTimeout(function () {
                playerNameInput.focus();
            }, 100);
        }
    };

    /**
     * 2. Helper Global Tutup Modal Game Over
     */
    window.dismissGameOverModal = function () {
        const gameOverModal = document.getElementById('gameOverModal');
        if (gameOverModal) {
            gameOverModal.classList.add('hidden');
            gameOverModal.style.display = 'none';
            gameOverModal.setAttribute('aria-hidden', 'true');
        }

        const feedbackEl = document.getElementById('submitFeedback');
        if (feedbackEl) {
            feedbackEl.textContent = '';
        }

        if (document.activeElement && typeof document.activeElement.blur === 'function') {
            document.activeElement.blur();
        }
    };

    /**
     * 3. Inisialisasi Event Listener Tombol Restart
     */
    document.addEventListener('DOMContentLoaded', function () {
        const btnRestart = document.getElementById('btnRestart') || document.getElementById('restartBtn');

        if (btnRestart) {
            btnRestart.addEventListener('click', function () {
                window.dismissGameOverModal();

                if (typeof window.resetGame === 'function') {
                    window.resetGame();
                } else {
                    console.warn("Fungsi window.resetGame() tidak ditemukan di game.js");
                }
            });
        }
    });

})();
