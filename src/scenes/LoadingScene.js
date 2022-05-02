export default class LoadingScene extends Phaser.Scene {
  constructor() {
    super('loading-scene');
  }

  preload() {
    this.load.image('player', 'assets/sprites/player.png');
    this.load.image('player-jump', 'assets/sprites/player-jump.png');
    this.load.image('player-fall', 'assets/sprites/player-fall.png');

    this.load.image('quest', 'assets/sprites/quest.png');
  
    this.load.image('floor', 'assets/sprites/floor-test.png');
    this.load.image('floor-left', 'assets/sprites/floor-test--left.png');
    this.load.image('floor-right', 'assets/sprites/floor-test--right.png');
    this.load.image('wall-left', 'assets/sprites/wall--left.png');
    this.load.image('wall-right', 'assets/sprites/wall--right.png');
    this.load.image('wall', 'assets/sprites/floor-inner.png');

    this.load.image('cloud', 'assets/sprites/cloud.png');
    this.load.image('cloud2', 'assets/sprites/cloud2.png');
  
    this.load.image('doggo', 'assets/sprites/doggo.png');
    this.load.image('anek', 'assets/sprites/anek.png');
    this.load.image('mountain', 'assets/sprites/mountain.png');
    this.load.image('biblioteka', 'assets/sprites/biblioteka.png');
    this.load.image('grannies', 'assets/sprites/grannies.png');
    this.load.image('domen_ru_1994', 'assets/sprites/domen.ru_1994.png');
  }

  create() {
    this.scene.start('level-scene');
  }
}
