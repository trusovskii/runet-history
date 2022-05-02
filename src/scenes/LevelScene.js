export default class LevelScene extends Phaser.Scene {
  constructor() {
    super('level-scene');
  }

  create() {
    window.levelscene = this;

    this.cameras.main.setBounds(0, 0, 9000, 1080);
    this.physics.world.setBounds(0, 0, 9000, 1080);
    this.physics.world.setBoundsCollision(true, true, false, true);

    this.floor = this.createFloor();
    this.platforms = this.createPlatforms();
    this.clouds = this.createClouds();
    this.player = this.createPlayer();
    this.entities = this.createEntities();

    this.floor.children.iterate((entry) => {
      this.children.bringToTop(entry);
    });
    this.children.bringToTop(this.player);

    this.physics.add.collider(this.player, this.platforms);
    this.physics.add.collider(this.player, this.floor);

    this.cameras.main.startFollow(this.player, true);

    this.cursors = this.input.keyboard.createCursorKeys();

    this.keyW = this.input.keyboard.addKey('W');
    this.keyA = this.input.keyboard.addKey('A');
    this.keyS = this.input.keyboard.addKey('S');
    this.keyD = this.input.keyboard.addKey('D');
  }

  createPlayer() {
    const player = this.physics.add.sprite(5000, 854, 'player');
    player.body.setSize(85, 99);
    player.body.setOffset(24, 20);
    player.setCollideWorldBounds(true);
    player.setAccelerationY(2000);

    // this.anims.create({
    //   key: "left",
    //   frames: this.anims.generateFrameNumbers(DUDE_KEY, { start: 0, end: 3 }),
    //   frameRate: 10,
    //   repeat: -1,
    // });

    // this.anims.create({
    //   key: "turn",
    //   frames: [{ key: DUDE_KEY, frame: 4 }],
    //   frameRate: 20,
    // });

    // this.anims.create({
    //   key: "right",
    //   frames: this.anims.generateFrameNumbers(DUDE_KEY, { start: 5, end: 8 }),
    //   frameRate: 10,
    //   repeat: -1,
    // });

    this.quest = this.add.sprite(0, 0, 'quest').setOrigin(0.5, 1).setVisible(false);

    return player;
  }

  /**
   * @returns {Phaser.Physics.Arcade.StaticGroup}
   */
  createFloor() {
    const floor = this.physics.add.staticGroup();
    this.createLargePlatform(floor, 0, 930, 70);
    return floor;
  }

  createPlatforms() {
    const platforms = this.physics.add.staticGroup();
    this.createLargePlatform(platforms, 300, 200, 1);
    this.createLargePlatform(platforms, 1000, 400, 2);
    this.createLargePlatform(platforms, 1700, 500, 1);
    this.createLargePlatform(platforms, 2400, 300, 4);
    this.createLargePlatform(platforms, 2200, 760, 3);
    this.createLargePlatform(platforms, 3400, 200, 1);
    this.createLargePlatform(platforms, 3700, 700, 1);
    this.createLargePlatform(platforms, 4000, 450, 1);
    this.createLargePlatform(platforms, 4500, 300, 2);
    this.createLargePlatform(platforms, 4500, 760, 1);
    this.createLargePlatform(platforms, 4950, 760, 1);
    return platforms;
  }

  createLargePlatform(group, x, y, width = 0, height = 0) {
    let offsetX = 0;
    let offsetY = 0;
    this.createPlatform(group, x + offsetX, y + offsetY, 'floor-left');
    offsetX += 115;
    for (let i = 0; i < width; i++) {
      this.createPlatform(group, x + offsetX, y + offsetY, 'floor');
      offsetX += 120;
    }
    this.createPlatform(group, x + offsetX, y + offsetY, 'floor-right');
    offsetY += 66;

    for (let i = 0; i < height; i++) {
      let wallOffsetX = 0;
      this.createPlatform(group, x + wallOffsetX, y + offsetY, 'wall-left');
      wallOffsetX += 115;
      for (let i = 0; i < width; i++) {
        this.createPlatform(group, x + wallOffsetX, y + offsetY, 'wall');
        wallOffsetX += 120;
      }
      this.createPlatform(group, x + wallOffsetX, y + offsetY, 'wall-right');
      offsetY += 60;
    }
  }

  createPlatform(group, x, y, key) {
    /** @type {Phaser.Physics.Arcade.Sprite} */
    const platform = group.create(x, y, key);
    platform.setOrigin(0, 0);
    platform.body.updateFromGameObject();
    if (key === 'floor') {
      platform.body.setSize(120, 54);
      platform.body.setOffset(0, 12);
    } else if (key === 'floor-left') {
      platform.body.setSize(115, 54);
      platform.body.setOffset(9, 12);
    } else if (key === 'floor-right') {
      platform.body.setSize(120, 54);
      platform.body.setOffset(0, 12);
    } else if (key === 'wall') {
      platform.body.setSize(120, 60);
      platform.body.setOffset(0, 0);
    } else if (key === 'wall-left') {
      platform.body.setSize(120, 60);
      platform.body.setOffset(9, 0);
    } else if (key === 'wall-right') {
      platform.body.setSize(120, 60);
      platform.body.setOffset(0, 0);
    }
    return platform;
  }

  createEntities() {
    const entities = {};
    entities.doggo = this.physics.add.sprite(1100, 950, 'doggo').setOrigin(0, 1);
    entities.doggo.aura = this.physics.add.existing(
      this.add
        .rectangle(
          entities.doggo.getBounds().centerX,
          entities.doggo.getBounds().bottom,
          300,
          200,
          0xff0000,
          0
        )
        .setOrigin(0.5, 1)
    );
    this.physics.add.overlap(this.player, entities.doggo.aura);

    entities.anek = this.physics.add.sprite(2800, 320, 'anek').setOrigin(0, 1);
    entities.anek.aura = this.physics.add.existing(
      this.add
        .rectangle(
          entities.anek.getBounds().centerX,
          entities.anek.getBounds().bottom,
          300,
          200,
          0x00ff00,
          0
        )
        .setOrigin(0.5, 1)
    );
    this.physics.add.overlap(this.player, entities.anek.aura);

    entities.some_place = this.physics.add.sprite(230, 100, 'some_place').setOrigin(0, 1);
    
    entities.mountain = this.physics.add.sprite(10, 950, 'mountain').setOrigin(0, 1);
    
    entities.biblioteka = this.physics.add.sprite(2430, 800, 'biblioteka').setOrigin(0, 1);

    entities.evil_guardians = this. physics.add.sprite(1050, 190, 'evil_guardians').setOrigin(0,1);

    entities.grannies = this. physics.add.sprite(1000, 435, 'grannies').setOrigin(0,1);

    entities.domen_ru_1994 = this. physics.add.sprite(1250, 960, 'domen_ru_1994').setOrigin(0,1);

    entities.Lebedev_1996 = this. physics.add.sprite(2850, 945, 'Lebedev_1996').setOrigin(0,1);

    entities.opera_com_1996 = this. physics.add.sprite(3600, 190, 'opera.com_1996').setOrigin(0,1);

    entities.yabloko_ru_1996 = this. physics.add.sprite(3300, 960, 'yabloko_ru_1996').setOrigin(0,1);

    entities.Rambler_1997 = this. physics.add.sprite(4150, 440, 'Rambler_1997').setOrigin(0,1);

    entities.Krovatka_1997 = this. physics.add.sprite(4650, 780, 'Krovatka_1997').setOrigin(0,1);

    entities.tetris_1997 = this. physics.add.sprite(4650, 330, 'tetris_1997').setOrigin(0,1);

    entities.ICQ_1997 = this. physics.add.sprite(5000, 950, 'ICQ_1997').setOrigin(0,1);

    entities.Zvuki_ru_1998 = this. physics.add.sprite(5100, 780, 'Zvuki_ru_1998').setOrigin(0,1);

    entities.Rif_1997 = this. physics.add.sprite(5700, 970, 'Rif_1997').setOrigin(0,1);

    entities.Kaspersky_ru_1997 = this. physics.add.sprite(5600, 950, 'Kaspersky_ru_1997').setOrigin(0,1);

    return entities;
  }



  createClouds() {
    const clouds = this.physics.add.staticGroup();
    return clouds;
  }

  handlePlayerMove() {
    if (this.cursors.left.isDown || this.keyA.isDown) {
      if (!this.player.body.blocked.left) {
        this.player.setVelocityX(-500);
        this.checkFlip(this.player);
      }

      // this.player.anims.play("left", true);
    } else if (this.cursors.right.isDown || this.keyD.isDown) {
      if (!this.player.body.blocked.right) {
        this.player.setVelocityX(500);
        this.checkFlip(this.player);
      }

      // this.player.anims.play("right", true);
    } else {
      this.player.setVelocityX(0);

      // this.player.anims.play("turn");
    }

    if ((this.cursors.up.isDown || this.keyW.isDown) && this.player.body.blocked.down) {
      this.player.setVelocityY(-1200);
    }

    if (this.player.body.velocity.y < 0) {
      this.player.setTexture('player-jump')
    } else if (this.player.body.velocity.y > 0) {
      this.player.setTexture('player-fall')
    } else {
      this.player.setTexture('player')
    }

    if (Phaser.Input.Keyboard.JustDown(this.cursors.space)) {
      console.log('space');
    }
  }

  update() {
    this.handlePlayerMove();

    this.quest.setPosition(this.player.getBounds().centerX, this.player.getBounds().top - 20);

    let questEntity = null;
    let showQuest = false;
    Object.entries(this.entities).forEach(([entityName, entity]) => {
      if (entity.aura) {
        if (!entity.aura.body.touching.none) {
          showQuest = true;
          questEntity = entityName;
        }
      }
    });
    if (this.quest.visible !== showQuest) {
      console.log(`${questEntity} is in range`);
      console.log((showQuest ? 'show' : 'hide') + ' quest');
      this.quest.setVisible(showQuest);
    }
  }

  checkFlip(sprite) {
    if (sprite.body.velocity.x < 0) {
      sprite.setFlipX(false);
    } else {
      sprite.scaleX = 1;
      sprite.setFlipX(true);
    }
  }
}
