import LevelScene from '@/scenes/LevelScene';
import LoadingScene from '@/scenes/LoadingScene';

const gameConfig = {
  title: 'Meme Game',
  type: Phaser.CANVAS,
  parent: 'game',
  backgroundColor: '#fff',
  scale: {
    mode: Phaser.Scale.ScaleModes.FIT,
    // mode: Phaser.Scale.ScaleModes.RESIZE,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: window.innerWidth,
    height: window.innerHeight,
    // min: {
    //   width: 1280,
    //   height: 720,
    // },
    // max: {
    //   width: 2560,
    //   height: 1440,
    // },
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: {
        y: 0,
      },
      // debug: true,
    },
  },
  // render: {
  //   antialiasGL: false,
  //   pixelArt: true,
  // },
  // callbacks: {
  //   postBoot: () => {
  //     window.sizeChanged();
  //   },
  // },
  canvasStyle: `display: block; width: 100%; height: 100%;`,
  autoFocus: true,
  audio: {
    disableWebAudio: false,
  },
  scene: [LoadingScene, LevelScene],
};

// window.sizeChanged = () => {
//   if (game.isBooted) {
//     setTimeout(() => {
//       game.scale.resize(window.innerWidth, window.innerHeight);
//       game.canvas.setAttribute(
//         'style',
//         `display: block; width: ${window.innerWidth}px; height: ${window.innerHeight}px;`
//       );
//     }, 100);
//   }
// };
// window.onresize = () => window.sizeChanged();

const game = new Phaser.Game(gameConfig);
