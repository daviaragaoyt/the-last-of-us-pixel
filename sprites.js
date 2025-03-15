// sprites.js
class AssetLoader {
  static loadImage(src) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = src;
      img.onload = () => resolve(img);
      img.onerror = () =>
        reject(new Error(`Erro ao carregar a imagem: ${src}`));
    });
  }

  static async loadSprites(spriteArray) {
    return Promise.all(spriteArray.map(src => this.loadImage(src)));
  }
}

const idleSprites = [
  "img/player/Cyborg-idle.png",
  "img/player/Cyborg-idle1.png",
  "img/player/Cyborg-idle2.png",
  "img/player/Cyborg-idle3.png"
];

const runSprites = [
  "img/player/run/Cyborg-run.png",
  "img/player/run/Cyborg-run1.png",
  "img/player/run/Cyborg-run2.png",
  "img/player/run/Cyborg-run3.png",
  "img/player/run/Cyborg-run4.png",
  "img/player/run/Cyborg-run5.png"
];

const jumpSprites = [
  "img/player/jump/Cyborg-jump.png",
  "img/player/jump/Cyborg-jump1.png",
  "img/player/jump/Cyborg-jump2.png",
  "img/player/jump/Cyborg-jump3.png"
];

const crouchSprites = [
  "img/player/crouch/Cyborg-crouch.png",
  "img/player/crouch/Cyborg-crouch1.png",
  "img/player/crouch/Cyborg-crouch2.png",
  "img/player/crouch/Cyborg-crouch1.png",
  "img/player/crouch/Cyborg-crouch.png"
];

const tileSprites = {
  tile01: "img/tiles/Tile_01.png", // canto esquerdo
  tile02: "img/tiles/Tile_02.png", // filler
  tile03: "img/tiles/Tile_03.png", // filler
  tile04: "img/tiles/Tile_04.png"  // canto direito ou filler final
};

// Sprites da maleta (briefcase) – a animação do seu estado de "aberta"
// Supondo que o frame 0 seja a maleta fechada e os demais mostrem a abertura progressiva.
const briefcaseSprites = [
  "img/pista/pista.png",
  "img/pista/pista1.png",
  "img/pista/pista2.png",
  "img/pista/pista3.png",
  "img/pista/pista4.png",
  "img/pista/pista5.png",
];

export { idleSprites, runSprites, AssetLoader, jumpSprites, crouchSprites, tileSprites, briefcaseSprites };
