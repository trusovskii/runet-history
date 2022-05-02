export default class Platform extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, texture) {
    super(scene, x, y, texture);
    scene.add.existing(this);
    scene.physics.add.existing(this, true);
    // this.body.setCollideWorldBounds(true);

    // this.body.setSize(85, 99);
    // this.body.setOffset(24, 20);
  }
}
