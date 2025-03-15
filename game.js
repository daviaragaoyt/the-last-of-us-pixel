// game.js
import { AssetLoader, runSprites } from './sprites.js';

class Character {
    constructor(x, y, runSprites) {
        this.x = x;
        this.y = y;
        this.runSprites = runSprites;
        this.currentFrame = 0;
        this.animationSpeed = 100;
        this.lastUpdate = Date.now();
        this.isRunning = false;
        this.speed = 2;
    }

    draw(ctx) {
        const frame = this.runSprites[this.currentFrame];
        ctx.drawImage(frame, this.x, this.y);
    }

    update() {
        const now = Date.now();

        if (this.isRunning && now - this.lastUpdate > this.animationSpeed) {
            this.currentFrame = (this.currentFrame + 1) % this.runSprites.length;
            this.lastUpdate = now;
        }

        if (this.isRunning) {
            this.x += this.speed;
        }
    }

    setRunning(isRunning) {
        this.isRunning = isRunning;
        if (!isRunning) {
            this.currentFrame = 0;
        }
    }
}

class Game {
    constructor(canvasId, player) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.player = player;
    }

    init() {
        this.gameLoop();
    }

    gameLoop() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.player.draw(this.ctx);
        this.player.update();
        requestAnimationFrame(() => this.gameLoop());
    }
}

// Exporta as classes
export { Character, Game };