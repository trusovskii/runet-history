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
  
    this.load.image('some_place', 'assets/sprites/some_place.png')
    this.load.image('doggo', 'assets/sprites/doggo.png');
    this.load.image('anek', 'assets/sprites/anek.png');
    this.load.image('mountain', 'assets/sprites/mountain.png');
    this.load.image('biblioteka', 'assets/sprites/biblioteka.png');
    this.load.image('evil_guardians', 'assets/sprites/evil_guardians.png');
    this.load.image('grannies', 'assets/sprites/grannies.png');
    this.load.image('domen_ru_1994', 'assets/sprites/domen.ru_1994.png');
    this.load.image('Lebedev_1996', 'assets/sprites/Lebedev_1996.png');
    this.load.image('opera.com_1996', 'assets/sprites/opera.com_1996.png');
    this.load.image('yabloko_ru_1996', 'assets/sprites/yabloko_ru_1996.png');
    this.load.image('Rambler_1997', 'assets/sprites/Rambler_1997.png');

    this.load.image('Krovatka_1997', 'assets/sprites/Krovatka_1997.png');
    this.load.image('tetris_1997', 'assets/sprites/tetris_1997.png')
    this.load.image('ICQ_1997', 'assets/sprites/ICQ_1997.png')
    this.load.image('Zvuki_ru_1998', 'assets/sprites/Zvuki_ru_1998.png')
    this.load.image('Rif_1997', 'assets/sprites/Rif_1997.png')
    this.load.image('Kaspersky_ru_1997', 'assets/sprites/Kaspersky_ru_1997.png')

  }

  
  create() {
    this.scene.start('level-scene');
  }
}
