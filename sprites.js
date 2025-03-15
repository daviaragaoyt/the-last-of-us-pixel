// sprites.js
class AssetLoader {
    static loadImage(src) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.src = src;
            img.onload = () => resolve(img);
            img.onerror = () => reject(new Error(`Erro ao carregar a imagem: ${src}`));
        });
    }

    static async loadSprites(spriteArray) {
        return Promise.all(spriteArray.map(src => this.loadImage(src)));
    }
}

// Sprites de "run"
const runSprites = [
    "img/player/run/Cyborg-run.png",
    "img/player/run/Cyborg-run1.png",
    "img/player/run/Cyborg-run2.png",
    "img/player/run/Cyborg-run3.png",
    "img/player/run/Cyborg-run4.png",
    "img/player/run/Cyborg-run5.png",
  
];

// Exporta as sprites e o AssetLoader
export { runSprites, AssetLoader };