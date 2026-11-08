/**
 * Core Game Engine (HTML5 Canvas 2D Prosedural)
 * Resolusi Render: 360 x 540 | Zero External Assets
 */

(function () {
    'use strict';

    const canvas = document.getElementById('gameCanvas');
    if (!canvas) {
        console.error("Elemen canvas dengan ID 'gameCanvas' tidak ditemukan!");
        return;
    }

    canvas.setAttribute('tabindex', '0');
    canvas.width = 360;
    canvas.height = 540;
    const ctx = canvas.getContext('2d');

    const STATES = {
        READY: 'READY',
        PLAYING: 'PLAYING',
        GAMEOVER: 'GAMEOVER'
    };
    let currentState = STATES.READY;

    const GRAVITY = 0.28;
    const JUMP_FORCE = -5.8;
    const PIPE_SPEED = 2.0;
    const PIPE_SPAWN_INTERVAL = 100;
    const PIPE_GAP = 125;
    const PIPE_WIDTH = 52;
    const GROUND_HEIGHT = 45;

    let frameCount = 0;
    let score = 0;
    let highScore = parseInt(localStorage.getItem('flappy_arcade_highscore') || '0', 10);
    const highScoreDom = document.getElementById('highScoreDisplay');
    if (highScoreDom) highScoreDom.textContent = highScore;

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

            this.rotation = Math.min(Math.PI / 4, Math.max(-Math.PI / 6, (this.velocity * 4.5) * Math.PI / 180));

            this.wingPhase += 0.2;

            if (this.y - this.radius <= 0) {
                this.y = this.radius;
                this.velocity = 0;
            }

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

            ctx.fillStyle = '#ffea00';
            ctx.beginPath();
            ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
            ctx.fill();
            ctx.lineWidth = 2.5;
            ctx.strokeStyle = '#d50000';
            ctx.stroke();

            const wingYOffset = Math.sin(this.wingPhase) * 3;
            ctx.fillStyle = '#fff176';
            ctx.beginPath();
            ctx.ellipse(-4, wingYOffset, 7, 4, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = '#f57f17';
            ctx.lineWidth = 1.5;
            ctx.stroke();

            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(5, -4, 4.5, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#111111';
            ctx.beginPath();
            ctx.arc(7, -4, 2, 0, Math.PI * 2);
            ctx.fill();

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

            if (
                bird.x + bird.radius > p.x &&
                bird.x - bird.radius < p.x + p.width &&
                bird.y - bird.radius < p.topHeight
            ) {
                triggerGameOver();
                return;
            }

            if (
                bird.x + bird.radius > p.x &&
                bird.x - bird.radius < p.x + p.width &&
                bird.y + bird.radius > p.bottomY
            ) {
                triggerGameOver();
                return;
            }

            if (!p.passed && p.x + p.width < bird.x) {
                p.passed = true;
                score += 1;
                const scoreDom = document.getElementById('currentScore');
                if (scoreDom) scoreDom.textContent = score;

                if (score > highScore) {
                    highScore = score;
                    localStorage.setItem('flappy_arcade_highscore', highScore.toString());
                    if (highScoreDom) highScoreDom.textContent = highScore;
                }
            }

            if (p.x + p.width < 0) {
                pipes.splice(i, 1);
            }
        }
    }

    function drawPipes() {
        for (let i = 0; i < pipes.length; i++) {
            const p = pipes[i];

            ctx.fillStyle = '#00e676';
            ctx.strokeStyle = '#004d40';
            ctx.lineWidth = 2.5;

            ctx.fillRect(p.x, 0, p.width, p.topHeight);
            ctx.strokeRect(p.x, 0, p.width, p.topHeight);

            ctx.fillRect(p.x - 3, p.topHeight - 16, p.width + 6, 16);
            ctx.strokeRect(p.x - 3, p.topHeight - 16, p.width + 6, 16);

            const bottomHeight = canvas.height - GROUND_HEIGHT - p.bottomY;
            ctx.fillRect(p.x, p.bottomY, p.width, bottomHeight);
            ctx.strokeRect(p.x, p.bottomY, p.width, bottomHeight);

            ctx.fillRect(p.x - 3, p.bottomY, p.width + 6, 16);
            ctx.strokeRect(p.x - 3, p.bottomY, p.width + 6, 16);
        }
    }

    let groundScroll = 0;

    function drawEnvironment() {
        const skyGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
        skyGrad.addColorStop(0, '#0c0721');
        skyGrad.addColorStop(0.65, '#2c1654');
        skyGrad.addColorStop(1, '#ff4081');
        ctx.fillStyle = skyGrad;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        for (let i = 0; i < 16; i++) {
            const sx = (i * 47) % canvas.width;
            const sy = (i * 29) % (canvas.height - GROUND_HEIGHT - 100);
            ctx.fillRect(sx, sy, 2, 2);
        }

        const groundY = canvas.height - GROUND_HEIGHT;
        ctx.fillStyle = '#4a148c';
        ctx.fillRect(0, groundY, canvas.width, GROUND_HEIGHT);

        ctx.fillStyle = '#7c43bd';
        ctx.fillRect(0, groundY, canvas.width, 4);

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

    function triggerGameOver() {
        if (currentState === STATES.GAMEOVER) return;
        currentState = STATES.GAMEOVER;

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
        } else if (currentState === STATES.GAMEOVER) {
            if (typeof window.restartGameFromModal === 'function') {
                window.restartGameFromModal();
            } else if (typeof window.resetGame === 'function') {
                window.resetGame();
            }
        }
    }
    window.handleGameInput = handleInput;

    function isInputElement(el) {
        if (!el) return false;
        const tag = el.tagName ? el.tagName.toUpperCase() : '';
        return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || el.isContentEditable;
    }

    // Tangkap tombol navigasi pada fase capture agar browser/Firefox tidak melakukan scroll
    window.addEventListener('keydown', function (e) {
        if (isInputElement(e.target) || isInputElement(document.activeElement)) {
            return;
        }

        const isSpace = e.code === 'Space' || e.key === ' ' || e.key === 'Spacebar' || e.keyCode === 32 || e.which === 32;
        const isUp = e.code === 'ArrowUp' || e.key === 'ArrowUp' || e.keyCode === 38;
        const isDown = e.code === 'ArrowDown' || e.key === 'ArrowDown' || e.keyCode === 40;
        const isPageNav = e.key === 'PageDown' || e.key === 'PageUp' || e.keyCode === 33 || e.keyCode === 34;

        if (isSpace || isUp || isDown || isPageNav) {
            e.preventDefault();
            e.stopPropagation();

            if (isSpace || isUp) {
                handleInput();
            }
        }
    }, { capture: true, passive: false });

    function triggerUserAction(e) {
        if (e && typeof e.preventDefault === 'function') {
            e.preventDefault();
        }
        if (typeof canvas.focus === 'function') {
            canvas.focus({ preventScroll: true });
        }
        handleInput();
    }

    if (window.PointerEvent) {
        canvas.addEventListener('pointerdown', triggerUserAction);
    } else {
        canvas.addEventListener('mousedown', triggerUserAction);
        canvas.addEventListener('touchstart', triggerUserAction, { passive: false });
    }
    canvas.addEventListener('click', triggerUserAction);

    function bindInteractiveElements() {
        const btnPlay = document.getElementById('btnPlay');
        if (btnPlay) {
            btnPlay.addEventListener('click', triggerUserAction);
            btnPlay.addEventListener('keydown', function (e) {
                const isSpace = e.code === 'Space' || e.key === ' ' || e.key === 'Spacebar' || e.keyCode === 32;
                if (isSpace) {
                    e.preventDefault();
                    triggerUserAction(e);
                }
            });
        }

        const screenEl = document.querySelector('.screen');
        if (screenEl) {
            screenEl.addEventListener('click', function (e) {
                if (e.target !== canvas) {
                    triggerUserAction(e);
                }
            });
        }

        document.querySelectorAll('.key-tag').forEach(tag => {
            tag.style.cursor = 'pointer';
            tag.addEventListener('click', triggerUserAction);
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', bindInteractiveElements);
    } else {
        bindInteractiveElements();
    }

    window.resetGame = function () {
        currentState = STATES.READY;
        score = 0;
        frameCount = 0;
        pipes = [];
        bird.reset();
        const scoreDom = document.getElementById('currentScore');
        if (scoreDom) scoreDom.textContent = '0';
    };

    function gameLoop() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        drawEnvironment();

        if (currentState === STATES.READY) {
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

    requestAnimationFrame(gameLoop);

})();
