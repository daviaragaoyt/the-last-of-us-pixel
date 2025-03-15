// game.js
import { runSprites, jumpSprites, crouchSprites, idleSprites } from './sprites.js';
import { Level } from './level.js';

class Character {
  constructor(x, y, runSprites, jumpSprites, crouchSprites, idleSprites) {
    this.x = x;
    this.y = y;
    this.originalGroundY = y; // Posição inicial do chão
    this.groundY = y;
    this.runSprites = runSprites;
    this.jumpSprites = jumpSprites;
    this.crouchSprites = crouchSprites;
    this.idleSprites = idleSprites;
    
    this.currentFrame = 0;
    this.animationSpeed = 100;
    this.lastUpdate = Date.now();
    
    this.currentIdleFrame = 0;
    this.idleAnimationSpeed = 200;
    this.lastIdleUpdate = Date.now();
    
    this.isRunning = false;
    this.isJumping = false;
    this.isCrouching = false;
    
    this.speed = 2;
    this.direction = 0; // -1 para esquerda, 1 para direita, 0 parado
    this.jumpHeight = 50;
    this.jumpVelocity = 0;
    this.gravity = 0.5;

    // Define largura e altura com base no primeiro sprite ou valores padrão
    this.width = runSprites[0].width || 100;
    this.height = runSprites[0].height || 100;
  }

  draw(ctx) {
    ctx.save();
    let sprite;
    if (this.isJumping) {
      sprite = this.jumpSprites[0];
    } else if (this.isCrouching) {
      sprite = this.crouchSprites[0];
    } else if (this.isRunning) {
      sprite = this.runSprites[this.currentFrame];
    } else {
      sprite = this.idleSprites[this.currentIdleFrame];
    }
    
    // Inverte a imagem se o personagem estiver indo para a esquerda
    if (this.direction === -1) {
      ctx.scale(-1, 1);
      ctx.drawImage(sprite, -this.x - this.width, this.y);
    } else {
      ctx.drawImage(sprite, this.x, this.y);
    }
    ctx.restore();
  }

  update() {
    const now = Date.now();
    if (this.isRunning && now - this.lastUpdate > this.animationSpeed) {
      this.currentFrame = (this.currentFrame + 1) % this.runSprites.length;
      this.lastUpdate = now;
    }
    if (!this.isRunning && !this.isJumping && !this.isCrouching) {
      if (now - this.lastIdleUpdate > this.idleAnimationSpeed) {
        this.currentIdleFrame = (this.currentIdleFrame + 1) % this.idleSprites.length;
        this.lastIdleUpdate = now;
      }
    }
    if (this.isRunning) {
      this.x += this.speed * this.direction;
    }
    if (this.isJumping) {
      this.y -= this.jumpVelocity;
      this.jumpVelocity -= this.gravity;
      if (this.y >= this.groundY) {
        this.y = this.groundY;
        this.isJumping = false;
      }
    }
  }

  setRunning(isRunning, direction) {
    this.isRunning = isRunning;
    if (isRunning) {
      this.direction = direction;
    } else {
      this.currentFrame = 0;
      this.direction = 0;
    }
  }

  jump() {
    if (!this.isJumping) {
      this.isJumping = true;
      this.jumpVelocity = this.jumpHeight / 5;
    }
  }

  crouch(isCrouching) {
    this.isCrouching = isCrouching;
  }
}

class Game {
  constructor(canvasId, player, borderTiles, briefcaseSprites) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');
    this.player = player;
    // Passa os tiles e as sprites das maletas para o nível
    this.level = new Level(borderTiles, briefcaseSprites);
  }

  init() {
    this.gameLoop();
  }

  gameLoop() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Desenha o mapa: fundo, bordas, obstáculos e pistas (maletas)
    this.level.draw(this.ctx);
    // Atualiza o chão do jogador com base nas plataformas e na saída
    this.level.updatePlayerGround(this.player);
    // Desenha e atualiza o personagem
    this.player.draw(this.ctx);
    this.player.update();
    // Verifica obstáculos overhead para forçar agachar
    this.level.checkOverheadObstacles(this.player);
    // Verifica se o jogador alcançou a plataforma de saída
    this.level.checkExit(this.player);
    // Verifica a coleta de pistas (maletas)
    this.level.collectClues(this.player);
    
    requestAnimationFrame(() => this.gameLoop());
  }
}

export { Character, Game };
