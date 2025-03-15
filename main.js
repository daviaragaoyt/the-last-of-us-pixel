// main.js
import { AssetLoader, runSprites } from './sprites.js';
import { Character, Game } from './game.js';

window.onload = async () => {
    // Carrega as sprites de "run"
    const loadedRunSprites = await AssetLoader.loadSprites(runSprites);

    // Inicializa o personagem
    const player = new Character(100, 100, loadedRunSprites);

    // Inicia o jogo
    const game = new Game('game-canvas', player);
    game.init();

    // Controles de teclado
    window.addEventListener('keydown', (event) => {
        if (event.key === 'ArrowRight') {
            player.setRunning(true);
        }
    });

    window.addEventListener('keyup', (event) => {
        if (event.key === 'ArrowRight') {
            player.setRunning(false);
        }
    });
};