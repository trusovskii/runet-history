export default class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'player');
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.body.setCollideWorldBounds(true);
    this.checkFlip();
    // KEYS
    this.keyW = this.scene.input.keyboard.addKey('W');
    this.keyA = this.scene.input.keyboard.addKey('A');
    this.keyS = this.scene.input.keyboard.addKey('S');
    this.keyD = this.scene.input.keyboard.addKey('D');
    // PHYSICS
    this.body.setSize(85, 99);
    this.body.setOffset(24, 20);
  }

  update() {
    if (Phaser.Input.Keyboard.JustDown(this.keyW)) {
      this.body.velocity.y = -600;
    }
    // if (this.keyW && this.keyW.isP) {
    //   if (this.body.velocity.y === 0) {
    //     this.body.velocity.y = -600;
    //   }
    // }

    if (this.keyA && this.keyA.isDown) {
      this.body.velocity.x = -300;
      this.checkFlip();
      // this.body.setOffset(this.width, 0);
    } else if (this.keyD && this.keyD.isDown) {
      this.body.velocity.x = 300;
      this.checkFlip();
      // this.body.setOffset(0, 0);
    } else {
      this.body.velocity.x = 0;
    }
  }

  checkFlip() {
    if (this.body.velocity.x < 0) {
      // this.scaleX = -1;
      this.setFlipX(false);
    } else {
      this.scaleX = 1;
      this.setFlipX(true);
    }
  }
}
