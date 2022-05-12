export default class LoadingScene extends Phaser.Scene {
  constructor() {
    super("loading-scene");
  }

  preload() {
    this.load.spritesheet("player", "assets/sprites/player.png", {
      frameWidth: 284,
      frameHeight: 275,
    });
    this.load.image("quest", "assets/sprites/quest.png");

    this.load.image("floor", "assets/sprites/floor-test.png");
    this.load.image("floor-left", "assets/sprites/floor-test--left.png");
    this.load.image("floor-right", "assets/sprites/floor-test--right.png");
    this.load.image("wall-left", "assets/sprites/wall--left.png");
    this.load.image("wall-right", "assets/sprites/wall--right.png");
    this.load.image("wall", "assets/sprites/floor-inner.png");

    this.load.image("mountains", "assets/bg/mountains.png");
    this.load.image("cloud", "assets/sprites/cloud.png");
    this.load.image("cloud2", "assets/sprites/cloud2.png");

    this.load.image("some_place", "assets/sprites/some_place.png");
    this.load.image("doggo", "assets/sprites/doggo.png");
    this.load.image("anek", "assets/sprites/anek.png");
    this.load.image("mountain", "assets/sprites/mountain.png");
    this.load.image("biblioteka", "assets/sprites/biblioteka.png");
    this.load.image("grannies", "assets/sprites/grannies.png");
    this.load.image("domen_ru_1994", "assets/sprites/domen.ru_1994.png");
    this.load.image("Lebedev_1996", "assets/sprites/Lebedev_1996.png");
    this.load.image("opera.com_1996", "assets/sprites/opera.com_1996.png");
    this.load.image("yabloko_ru_1996", "assets/sprites/yabloko_ru_1996.png");
    this.load.image("Rambler_1997", "assets/sprites/Rambler_1997.png");
    this.load.image("Krovatka_1997", "assets/sprites/Krovatka_1997.png");
    this.load.image("tetris_1997", "assets/sprites/tetris_1997.png");
    this.load.image("ICQ_1997", "assets/sprites/ICQ_1997.png");
    this.load.image("Zvuki_ru_1998", "assets/sprites/Zvuki_ru_1998.png");
    this.load.image("Rif_1997", "assets/sprites/Rif_1997.png");
    this.load.image(
      "Kaspersky_ru_1997",
      "assets/sprites/Kaspersky_ru_1997.png"
    );

    this.load.image("mail_ru_1998", "assets/sprites/mail_ru_1998.png");
    this.load.image("pepsi_1998", "assets/sprites/pepsi_1998.png");
    this.load.image("Webmoney_1998", "assets/sprites/Webmoney_1998.png");
    this.load.image("fuck_ru_1998", "assets/sprites/fuck_ru_1998.png");
    this.load.image("TV_1999", "assets/sprites/TV_1999.png");



    this.load.image("bazar_1997", "assets/sprites/bazar_1997.png");

    this.load.image("bubble-line", "assets/sprites/bubble-line.png");
    this.load.image("bubble-speech", "assets/sprites/bubble-speech.png");
    this.load.image(
      "bubble-speech-large",
      "assets/sprites/bubble-speech-large.png"
    );
    this.load.image("answer-bubble-1", "assets/sprites/answer-bubble-1.png");
    this.load.image("answer-bubble-2", "assets/sprites/answer-bubble-2.png");
    this.load.image("answer-bubble-3", "assets/sprites/answer-bubble-3.png");
    this.load.image("answer-bubble-4", "assets/sprites/answer-bubble-4.png");

    this.load.image("control-left", "assets/controls/left.png");
    this.load.image("control-right", "assets/controls/right.png");
    this.load.image("control-jump", "assets/controls/jump.png");
    this.load.image("control-speak", "assets/controls/scream.png");
  }

  create() {
    this.scene.start("level-scene");
  }
}
