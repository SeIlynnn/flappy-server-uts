/**
 * =========================================================================
 * FILE: game.js
 * Core Game Engine (HTML5 Canvas 2D Prosedural)
 * Target Resolusi Render: 360 x 540 | Zero External Assets
 * =========================================================================
 */

(function () {
    'use strict';

    // 1. Inisialisasi Canvas & Context
    const canvas = document.getElementById('gameCanvas');
    if (!canvas) {
        console.error("Elemen canvas dengan ID 'gameCanvas' tidak ditemukan!");
        return;
    }

    // Kunci resolusi render internal tepat 360 x 540
    canvas.width = 360;
    canvas.height = 540;
    const ctx = canvas.getContext('2d');

    // 2. Definisi State Game
    const STATES = {
        READY: 'READY',
        PLAYING: 'PLAYING',
        GAMEOVER: 'GAMEOVER'
    };
    let currentState = STATES.READY;

    // 3. Konstanta Fisika & Permainan
    const GRAVITY = 0.28;
    const JUMP_FORCE = -5.8;
    const PIPE_SPEED = 2.0;
    const PIPE_SPAWN_INTERVAL = 100; // frames
    const PIPE_GAP = 125;            // tinggi celah antara pipa atas & bawah
    const PIPE_WIDTH = 52;
    const GROUND_HEIGHT = 45;

    let frameCount = 0;
    let score = 0;
    let highScore = parseInt(localStorage.getItem('flappy_arcade_highscore') || '0', 10);
    const highScoreDom = document.getElementById('highScoreDisplay');
    if (highScoreDom) highScoreDom.textContent = highScore;

    // 4. Objek Burung (Prosedural Pixel/Arcade Art)
    const bird = {
        x: 65,
        y: canvas.height / 2 - 20,
        radius: 13,
        velocity: 0,
        rotation: 0,
        wingPhase: 0,

        jump: function () {
            this.velocity = JUMP_FORCE;
        },

        update: function () {
            this.velocity += GRAVITY;
            this.y += this.velocity;

            // Rotasi berdasarkan kecepatan jatuh
            this.rotation = Math.min(Math.PI / 4, Math.max(-Math.PI / 6, (this.velocity * 4.5) * Math.PI / 180));

            // Animasi kepakan sayap
            this.wingPhase += 0.2;

            // AABB Collision: Atap Canvas
            if (this.y - this.radius <= 0) {
                this.y = this.radius;
                this.velocity = 0;
            }

            // AABB Collision: Lantai Canvas
            const floorLimit = canvas.height - GROUND_HEIGHT;
            if (this.y + this.radius >= floorLimit) {
                this.y = floorLimit - this.radius;
                triggerGameOver();
            }
        },

        draw: function () {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.rotation);

            // Badan Burung (Lingkaran Kuning Arcade + Outline)
            ctx.fillStyle = '#ffea00';
            ctx.beginPath();
            ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
            ctx.fill();
            ctx.lineWidth = 2.5;
            ctx.strokeStyle = '#d50000';
            ctx.stroke();

            // Sayap (Animasi kepakan vertikal)
            const wingYOffset = Math.sin(this.wingPhase) * 3;
            ctx.fillStyle = '#fff176';
            ctx.beginPath();
            ctx.ellipse(-4, wingYOffset, 7, 4, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = '#f57f17';
            ctx.lineWidth = 1.5;
            ctx.stroke();

            // Mata Putih & Pupil Hitam
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(5, -4, 4.5, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#111111';
            ctx.beginPath();
            ctx.arc(7, -4, 2, 0, Math.PI * 2);
            ctx.fill();

            // Paruh Oranye
            ctx.fillStyle = '#ff5722';
            ctx.beginPath();
            ctx.moveTo(8, 0);
            ctx.lineTo(15, 3);
            ctx.lineTo(8, 6);
            ctx.closePath();
            ctx.fill();
            ctx.strokeStyle = '#bf360c';
            ctx.lineWidth = 1;
            ctx.stroke();

            ctx.restore();
        },

        reset: function () {
            this.x = 65;
            this.y = canvas.height / 2 - 20;
            this.velocity = 0;
            this.rotation = 0;
            this.wingPhase = 0;
        }
    };

    // 5. Rintangan Pipa Acak
    let pipes = [];

    function spawnPipe() {
        const availableHeight = canvas.height - GROUND_HEIGHT - PIPE_GAP - 60;
        const topHeight = Math.floor(Math.random() * availableHeight) + 30;
        const bottomY = topHeight + PIPE_GAP;

        pipes.push({
            x: canvas.width,
            width: PIPE_WIDTH,
            topHeight: topHeight,
            bottomY: bottomY,
            passed: false
        });
    }

    function updatePipes() {
        if (frameCount % PIPE_SPAWN_INTERVAL === 0) {
            spawnPipe();
        }

        for (let i = pipes.length - 1; i >= 0; i--) {
            const p = pipes[i];
            p.x -= PIPE_SPEED;

            // AABB Collision Detection: Pipa Atas
            if (
                bird.x + bird.radius > p.x &&
                bird.x - bird.radius < p.x + p.width &&
                bird.y - bird.radius < p.topHeight
            ) {
                triggerGameOver();
                return;
            }

            // AABB Collision Detection: Pipa Bawah
            if (
                bird.x + bird.radius > p.x &&
                bird.x - bird.radius < p.x + p.width &&
                bird.y + bird.radius > p.bottomY
            ) {
                triggerGameOver();
                return;
            }

            // Sistem Skor: Tambah 1 jika burung melewati pipa
            if (!p.passed && p.x + p.width < bird.x) {
                p.passed = true;
                score += 1;
                // Update elemen DOM skor saat ini
                const scoreDom = document.getElementById('currentScore');
                if (scoreDom) scoreDom.textContent = score;

                // Update rekor skor tertinggi (Local Storage & HUD)
                if (score > highScore) {
                    highScore = score;
                    localStorage.setItem('flappy_arcade_highscore', highScore.toString());
                    if (highScoreDom) highScoreDom.textContent = highScore;
                }
            }

            // Hapus pipa yang keluar dari batas layar
            if (p.x + p.width < 0) {
                pipes.splice(i, 1);
            }
        }
    }

    function drawPipes() {
        for (let i = 0; i < pipes.length; i++) {
            const p = pipes[i];

            // Warna Pipa Hijau Retro Arcade
            ctx.fillStyle = '#00e676';
            ctx.strokeStyle = '#004d40';
            ctx.lineWidth = 2.5;

            // Pipa Atas
            ctx.fillRect(p.x, 0, p.width, p.topHeight);
            ctx.strokeRect(p.x, 0, p.width, p.topHeight);

            // Bibir Pipa Atas
            ctx.fillRect(p.x - 3, p.topHeight - 16, p.width + 6, 16);
            ctx.strokeRect(p.x - 3, p.topHeight - 16, p.width + 6, 16);

            // Pipa Bawah
            const bottomHeight = canvas.height - GROUND_HEIGHT - p.bottomY;
            ctx.fillRect(p.x, p.bottomY, p.width, bottomHeight);
            ctx.strokeRect(p.x, p.bottomY, p.width, bottomHeight);

            // Bibir Pipa Bawah
            ctx.fillRect(p.x - 3, p.bottomY, p.width + 6, 16);
            ctx.strokeRect(p.x - 3, p.bottomY, p.width + 6, 16);
        }
    }

    // 6. Grafis Prosedural Lingkungan (Langit, Bintang, Lantai)
    let groundScroll = 0;

    function drawEnvironment() {
        // Langit Gradasi Senja Retro
        const skyGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
        skyGrad.addColorStop(0, '#0c0721');
        skyGrad.addColorStop(0.65, '#2c1654');
        skyGrad.addColorStop(1, '#ff4081');
        ctx.fillStyle = skyGrad;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Bintang Pixel Statis
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        for (let i = 0; i < 16; i++) {
            const sx = (i * 47) % canvas.width;
            const sy = (i * 29) % (canvas.height - GROUND_HEIGHT - 100);
            ctx.fillRect(sx, sy, 2, 2);
        }

        // Lantai / Tanah Bergerak
        const groundY = canvas.height - GROUND_HEIGHT;
        ctx.fillStyle = '#4a148c';
        ctx.fillRect(0, groundY, canvas.width, GROUND_HEIGHT);

        // Garis Pembatas Atas Lantai
        ctx.fillStyle = '#7c43bd';
        ctx.fillRect(0, groundY, canvas.width, 4);

        // Pola Garis Strip Lantai Berjalan
        if (currentState === STATES.PLAYING) {
            groundScroll = (groundScroll + PIPE_SPEED) % 20;
        }
        ctx.strokeStyle = '#27084d';
        ctx.lineWidth = 2;
        for (let x = -groundScroll; x < canvas.width; x += 20) {
            ctx.beginPath();
            ctx.moveTo(x, groundY);
            ctx.lineTo(x + 10, canvas.height);
            ctx.stroke();
        }
    }

    // 7. Render HUD / Teks Pada Canvas
    function drawHUD() {
        if (currentState === STATES.READY) {
            ctx.save();
            ctx.fillStyle = '#ffffff';
            ctx.textAlign = 'center';
            ctx.font = 'bold 16px "Courier New", monospace';
            ctx.shadowColor = '#00f3ff';
            ctx.shadowBlur = 8;
            ctx.fillText('TEKAN SPASI / KLIK', canvas.width / 2, canvas.height / 2 + 50);
            ctx.font = '12px "Courier New", monospace';
            ctx.fillText('UNTUK MEMULAI TERBANG', canvas.width / 2, canvas.height / 2 + 75);
            ctx.restore();
        } else if (currentState === STATES.PLAYING) {
            // Tampilan skor saat bermain di tengah atas canvas
            ctx.save();
            ctx.fillStyle = '#ffffff';
            ctx.strokeStyle = '#000000';
            ctx.lineWidth = 4;
            ctx.font = 'bold 36px "Courier New", monospace';
            ctx.textAlign = 'center';
            ctx.strokeText(score.toString(), canvas.width / 2, 55);
            ctx.fillText(score.toString(), canvas.width / 2, 55);
            ctx.restore();
        }
    }

    // 8. Logika Transisi State & Game Over
    function triggerGameOver() {
        if (currentState === STATES.GAMEOVER) return;
        currentState = STATES.GAMEOVER;

        // Panggil fungsi global window.handleGameOver sesuai spesifikasi
        if (typeof window.handleGameOver === 'function') {
            window.handleGameOver(score);
        } else {
            console.warn("window.handleGameOver(finalScore) belum didefinisikan secara global. Skor akhir:", score);
        }
    }

    function handleInput() {
        if (currentState === STATES.READY) {
            currentState = STATES.PLAYING;
            bird.jump();
        } else if (currentState === STATES.PLAYING) {
            bird.jump();
        }
    }

    // 9. Event Listeners Kontrol: Spacebar, Klik Mouse, dan Layar Sentuh
    window.addEventListener('keydown', function (e) {
        // Jangan cegat tombol jika pemain sedang mengetik di input form nama
        const activeTag = document.activeElement ? document.activeElement.tagName : '';
        if (activeTag === 'INPUT' || activeTag === 'TEXTAREA' || e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
            return;
        }

        if (e.code === 'Space' || e.key === ' ' || e.code === 'ArrowUp') {
            if (currentState !== STATES.GAMEOVER) {
                e.preventDefault();
                handleInput();
            }
        }
    });

    canvas.addEventListener('mousedown', function (e) {
        e.preventDefault();
        handleInput();
    });

    canvas.addEventListener('touchstart', function (e) {
        e.preventDefault();
        handleInput();
    }, { passive: false });

    // 10. Fungsi Reset Global untuk Memulai Ulang Permainan
    window.resetGame = function () {
        currentState = STATES.READY;
        score = 0;
        frameCount = 0;
        pipes = [];
        bird.reset();
        const scoreDom = document.getElementById('currentScore');
        if (scoreDom) scoreDom.textContent = '0';
    };

    // 11. Main Loop Animasi
    function gameLoop() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        drawEnvironment();

        if (currentState === STATES.READY) {
            // Animasi idle mengambang lembut saat ready
            bird.y = (canvas.height / 2 - 20) + Math.sin(Date.now() / 200) * 5;
            bird.draw();
            drawHUD();
        } else if (currentState === STATES.PLAYING) {
            frameCount++;
            bird.update();
            updatePipes();
            drawPipes();
            bird.draw();
            drawHUD();
        } else if (currentState === STATES.GAMEOVER) {
            drawPipes();
            bird.draw();
            drawHUD();
        }

        requestAnimationFrame(gameLoop);
    }

    // Jalankan loop utama
    requestAnimationFrame(gameLoop);

})();
