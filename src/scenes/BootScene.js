export default class BootScene extends Phaser.Scene {
  constructor() {
    super("boot-scene");
  }

  preload() {
    this.load.spritesheet("boy", `./assets/sprites/boy.png?cb=${cb}`, {
      frameWidth: 388,
      frameHeight: 604,
    });
  }

  create() {
    this.scene.start("loading-scene");
  }
}