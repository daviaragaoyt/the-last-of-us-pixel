// main.js
import { AssetLoader, runSprites, jumpSprites, crouchSprites, idleSprites, tileSprites, briefcaseSprites } from './sprites.js';
import { Character, Game } from './game.js';

window.onload = async () => {
  // Carrega as sprites do personagem
  const loadedRunSprites = await AssetLoader.loadSprites(runSprites);
  const loadedJumpSprites = await AssetLoader.loadSprites(jumpSprites);
  const loadedCrouchSprites = await AssetLoader.loadSprites(crouchSprites);
  const loadedIdleSprites = await AssetLoader.loadSprites(idleSprites);

  // Carrega os tiles para as bordas do mapa
  const loadedTile01 = await AssetLoader.loadImage(tileSprites.tile01);
  const loadedTile02 = await AssetLoader.loadImage(tileSprites.tile02);
  const loadedTile03 = await AssetLoader.loadImage(tileSprites.tile03);
  const loadedTile04 = await AssetLoader.loadImage(tileSprites.tile04);

  const borderTiles = {
    tile01: loadedTile01,
    tile02: loadedTile02,
    tile03: loadedTile03,
    tile04: loadedTile04,
  };

  // Carrega as sprites da maleta (briefcase)
  const loadedBriefcaseSprites = await AssetLoader.loadSprites(briefcaseSprites);

  // Inicializa o personagem na posição desejada (ex.: x = 100, y = 500 para começar no chão)
  const player = new Character(100, 500, loadedRunSprites, loadedJumpSprites, loadedCrouchSprites, loadedIdleSprites);
  
  // Inicia o jogo passando os borderTiles e as briefcaseSprites para compor as bordas e as pistas
  const game = new Game('game-canvas', player, borderTiles, loadedBriefcaseSprites);
  game.init();

  // Controles de teclado
  window.addEventListener('keydown', (event) => {
    if (event.key === 'd') {
      player.setRunning(true, 1); // Move para a direita
    } else if (event.key === 'a') {
      player.setRunning(true, -1); // Move para a esquerda
    } else if (event.key === 'w') {
      player.jump(); // Pula (útil para alcançar a saída)
    } else if (event.key === 's') {
      player.crouch(true); // Agacha para evitar obstáculos overhead
    }
  });

  window.addEventListener('keyup', (event) => {
    if (event.key === 'd' || event.key === 'a') {
      player.setRunning(false, 0);
    } else if (event.key === 's') {
      player.crouch(false);
    }
  });
};
