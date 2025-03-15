// level.js
class Level {
    constructor(borderTiles, briefcaseSprites) {
      this.borderTiles = borderTiles;
      this.briefcaseSprites = briefcaseSprites;
  
      // Obstáculos espalhados pelo mapa com tipos:
      // 'platform': plataformas onde o jogador pode pousar;
      // 'overhead': obstáculo que exige agachar;
      // 'exit': plataforma de saída para a próxima fase.
      this.obstacles = [
        { x: 100, y: 520, width: 150, height: 20, color: '#444', type: 'platform' },
        { x: 300, y: 480, width: 100, height: 20, color: '#444', type: 'platform' },
        { x: 600, y: 500, width: 130, height: 20, color: '#444', type: 'platform' },
        // Obstáculo overhead: se o jogador não agachar, colide
        { x: 250, y: 450, width: 100, height: 20, color: '#888', type: 'overhead' },
        // Plataforma de saída – o jogador precisa pular para alcançá-la
        { x: 400, y: 70, width: 150, height: 20, color: 'red', type: 'exit' }
      ];
  
      // Clues representados como maletas (briefcases)
      // Cada objeto possui propriedades para controle da animação
      this.clues = [
        { x: 120, y: 480, width: 50, height: 50, collected: false, currentFrame: 0, lastUpdate: 0, animationSpeed: 100 },
        { x: 320, y: 440, width: 50, height: 25, collected: false, currentFrame: 0, lastUpdate: 0, animationSpeed: 100 },
        { x: 470, y: 500, width: 50, height: 25, collected: false, currentFrame: 0, lastUpdate: 0, animationSpeed: 100 }
      ];
    }
  
    // Desenha as bordas superiores usando os tiles (com gap opcional para a saída)
    drawBorders(ctx) {
      const { tile01, tile02, tile03, tile04 } = this.borderTiles;
      const tileWidth = tile01.width;
      const canvasWidth = ctx.canvas.width;
      
      // Define um gap central para a saída (opcional)
      const exitGapWidth = 100;
      const gapStart = canvasWidth / 2 - exitGapWidth / 2;
      const gapEnd = canvasWidth / 2 + exitGapWidth / 2;
      
      let x = 0;
      if (x < gapStart) {
        ctx.drawImage(tile01, x, 0);
        x += tileWidth;
        while (x < gapStart) {
          let tile = ((x / tileWidth) % 2 === 0) ? tile02 : tile03;
          ctx.drawImage(tile, x, 0);
          x += tileWidth;
        }
      }
      x = gapEnd;
      while (x < canvasWidth - tile04.width) {
        let tile = ((x / tileWidth) % 2 === 0) ? tile02 : tile03;
        ctx.drawImage(tile, x, 0);
        x += tileWidth;
      }
      ctx.drawImage(tile04, canvasWidth - tile04.width, 0);
    }
  
    // Desenha o fundo, as bordas, os obstáculos e as pistas (maletas)
    draw(ctx) {
      // Fundo
      ctx.fillStyle = '#111';
      ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      
      // Bordas superiores
      this.drawBorders(ctx);
      
      // Obstáculos
      this.obstacles.forEach(obstacle => {
        ctx.fillStyle = obstacle.color;
        ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
      });
      
      // Desenha as pistas (maletas)
      this.clues.forEach(clue => {
        if (!clue.collected) {
          // Clue ainda não coletada: mostra a maleta fechada (primeiro frame)
          ctx.drawImage(this.briefcaseSprites[0], clue.x, clue.y, clue.width, clue.height);
        } else {
          // Se coletada, anima a maleta abrindo
          const now = Date.now();
          if (!clue.lastUpdate) clue.lastUpdate = now;
          if (now - clue.lastUpdate > clue.animationSpeed) {
            clue.currentFrame++;
            clue.lastUpdate = now;
            if (clue.currentFrame >= this.briefcaseSprites.length) {
              clue.currentFrame = this.briefcaseSprites.length - 1; // Mantém no último frame (maleta aberta)
            }
          }
          ctx.drawImage(this.briefcaseSprites[clue.currentFrame], clue.x, clue.y, clue.width, clue.height);
        }
      });
    }
  
    // Atualiza o "chão" do jogador com base em plataformas e na saída
    updatePlayerGround(player) {
      let newGround = player.originalGroundY;
      this.obstacles.forEach(obstacle => {
        if ((obstacle.type === 'platform' || obstacle.type === 'exit') &&
            player.x + player.width > obstacle.x &&
            player.x < obstacle.x + obstacle.width) {
          if (player.y + player.height <= obstacle.y + 10) {
            newGround = Math.min(newGround, obstacle.y - player.height);
          }
        }
      });
      player.groundY = newGround;
    }
  
    // Verifica colisão com obstáculos overhead. Se o jogador não estiver agachando, simula impacto.
    checkOverheadObstacles(player) {
      this.obstacles.forEach(obstacle => {
        if (obstacle.type === 'overhead') {
          if (this.checkCollision(
              { x: player.x, y: player.y, width: player.width, height: player.height },
              obstacle
            )) {
            if (!player.isCrouching) {
              console.log("Agache para evitar o obstáculo overhead!");
              // Simula impacto empurrando o jogador para baixo
              player.y = obstacle.y + obstacle.height;
            }
          }
        }
      });
    }
  
    // Verifica se o jogador alcançou a plataforma de saída
    checkExit(player) {
      this.obstacles.forEach(obstacle => {
        if (obstacle.type === 'exit') {
          if (this.checkCollision(
              { x: player.x, y: player.y, width: player.width, height: player.height },
              obstacle
            )) {
            console.log("Você alcançou a porta da próxima fase!");
            // Aqui você pode disparar a transição para a próxima fase
          }
        }
      });
    }
  
    // Checa colisão entre dois retângulos
    checkCollision(rect1, rect2) {
      return rect1.x < rect2.x + rect2.width &&
             rect1.x + rect1.width > rect2.x &&
             rect1.y < rect2.y + rect2.height &&
             rect1.y + rect1.height > rect2.y;
    }
  
    // Verifica a coleta de pistas: ao colidir, marca o clue como coletado (para iniciar a animação de abertura)
    collectClues(player) {
      this.clues.forEach(clue => {
        if (!clue.collected && this.checkCollision(
            { x: player.x, y: player.y, width: player.width, height: player.height },
            clue)) {
          clue.collected = true;
          clue.currentFrame = 0; // Reinicia a animação
          clue.lastUpdate = Date.now();
          console.log("Maleta coletada! Revelando pista...");
          // Aqui você pode, por exemplo, disparar a exibição de um texto com o motivo do personagem estar no subsolo.
        }
      });
    }
  }
  
  export { Level };
  