import Entities from "../Entities";

const WORLD_WIDTH = 10000;
const WORLD_HEIGHT = 1080;

const layers = {
  BACKGROUND: 1000,
  FLOOR: 1010,
  PLATFORMS: 1020,
  PLAYER: 1030,
  ENTITIES: 1040,
  CONTROLS: 1050,
};

export default class LevelScene extends Phaser.Scene {
  constructor() {
    super("level-scene");
    window.levelscene = this;
    this.isLandscape = false;
    this.isMobile = false;
    this.shouldResizeStaticObjects = true;
  }

  create() {
    this.physics.world.setBounds(0, 0, WORLD_WIDTH, WORLD_HEIGHT);
    this.physics.world.setBoundsCollision(true, true, false, true);
    this.cameras.main.setBounds(0, 0, WORLD_WIDTH, WORLD_HEIGHT);

    this.input.addPointer(4);

    this.createBackground();
    this.createFloor();
    this.createPlatforms();
    this.createPlayer();
    this.createEntities();
    this.createControls();

    this.debugText = this.add
      .text(0, 0, "debug", {
        fontFamily: "DigitalStrip",
        fontSize: 20,
        lineSpacing: 8,
        color: "#404",
        wordWrap: { width: 400, useAdvancedWrap: true },
      })
      .setOrigin(0, 0)
      .setScrollFactor(0, 0)
      .setDepth(9999)
      .setVisible(false);

    this.floor.children.iterate((entry) => {
      this.children.bringToTop(entry);
    });
    Object.values(this.entities).forEach((entry) => {
      this.children.bringToTop(entry);
    });
    this.children.bringToTop(this.player);
    this.children.bringToTop(this.quest);

    this.physics.add.collider(this.player, this.platforms);
    this.physics.add.collider(this.player, this.floor);

    this.cameras.main.startFollow(this.player, true);

    this.cursors = this.input.keyboard.createCursorKeys();

    this.keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    this.keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    this.keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
    this.keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    this.keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);

    this.key1 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ONE);
    this.key2 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.TWO);
    this.key3 = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.THREE
    );
    this.key4 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.FOUR);

    this.keyPlus = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.PLUS
    );
    this.keyMinus = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.MINUS
    );

    this.touchState = {
      left: false,
      right: false,
      jump: false,
      action: false,
    };

    this.activeQuestEntityName = null;
    this.activeQuizEntityName = null;

    this.playerFlags = {
      canMove: true,
      quizQuestion: false,
      quizDialogue: false,
    };

    this.physics.world.drawDebug = false;
    this.physics.world.debugGraphic.clear();

    this.safeAreaLeft = 0;
    this.safeAreaRight = 0;

    console.log("listen to resize");
    this.events.on("resize", () => {
      console.log("scene resize");
      this.onResize();
    });
    this.events.once("postupdate", () => {
      console.log("scene postupdate");
      this.onResize();
    });
  }

  onResize() {
    console.log("scene on resize");
    this.isLandscape = window.innerWidth > window.innerHeight;
    this.isMobile = this.isLandscape && window.innerWidth <= 1024;

    this.cameras.main.zoom = this.getScaledZoom();
    this.safeAreaLeft =
      parseInt(
        getComputedStyle(document.documentElement).getPropertyValue(
          "--safe-area-left"
        )
      ) || 0;
    this.safeAreaRight =
      parseInt(
        getComputedStyle(document.documentElement).getPropertyValue(
          "--safe-area-right"
        )
      ) || 0;

    this.shouldResizeStaticObjects = true;
  }

  getScaledZoom() {
    return (
      Math.round((window.innerHeight / 1080) * (this.isMobile ? 2 : 1) * 128) /
      128
    );
  }

  createPlayer() {
    const player = this.physics.add.sprite(2000, 700);
    player.body.setSize(30, 200);
    player.setScale(0.4, 0.4);
    player.body.setOffset(120, 40);
    player.setCollideWorldBounds(true);
    player.setAccelerationY(2000);

    this.anims.create({
      key: "still",
      frames: this.anims.generateFrameNumbers("player", {
        frames: [15],
      }),
      repeat: -1,
    });
    this.anims.create({
      key: "jump",
      frames: this.anims.generateFrameNumbers("player", {
        frames: [14],
      }),
      repeat: -1,
    });
    this.anims.create({
      key: "fall",
      frames: this.anims.generateFrameNumbers("player", {
        frames: [13],
      }),
      repeat: -1,
    });
    this.anims.create({
      key: "run",
      frames: this.anims.generateFrameNumbers("player", {
        frames: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
      }),
      repeat: -1,
    });

    player.play("still");

    this.quest = this.add
      .sprite(0, 0, "quest")
      .setOrigin(0.5, 1)
      .setVisible(false);

    this.player = player;
  }

  /**
   * @returns {Phaser.Physics.Arcade.StaticGroup}
   */
  createFloor() {
    const floor = this.physics.add.staticGroup();
    this.createLargePlatform(floor, 0, 930, 90);
    this.floor = floor;
  }

  createBackground() {
    const bgLayer = this.add.layer();
    const mountains = this.add
      .tileSprite(
        0,
        1080,
        window.innerWidth,
        this.textures.get("mountains").getSourceImage().height,
        "mountains"
      )
      .setOrigin(0, 1)
      .setScrollFactor(0, 1);
    bgLayer.add([mountains]);
    this.bg = {
      layer: bgLayer,
      mountains,
    };
  }

  createPlatforms() {
    const platforms = this.physics.add.staticGroup();
    this.createLargePlatform(
      platforms,
      300,
      190,
      1
    ); /** Место для самолюбования */

    this.createLargePlatform(platforms, 1140, 400, 3); /** Бабули */

    this.createLargePlatform(platforms, 3050, 300, 1); /** Свинка */
    this.createLargePlatform(platforms, 5060, 200, 1); /** Тетрис */

    this.createLargePlatform(platforms, 5800, 400, 2); /** Касперский */
    this.createLargePlatform(platforms, 6600, 600, 1); /** Около Рифа */

    this.createLargePlatform(platforms, 7400, 350, 1); /** Мейл.ру */

    this.createLargePlatform(platforms, 8700, 250, 1); /** Телевизор */

    this.platforms = platforms;
  }

  createLargePlatform(group, x, y, width = 0, height = 0) {
    let offsetX = 0;
    let offsetY = 0;
    this.createPlatform(group, x + offsetX, y + offsetY, "floor-left");
    offsetX += 115;
    for (let i = 0; i < width; i++) {
      this.createPlatform(group, x + offsetX, y + offsetY, "floor");
      offsetX += 120;
    }
    this.createPlatform(group, x + offsetX, y + offsetY, "floor-right");
    offsetY += 66;

    for (let i = 0; i < height; i++) {
      let wallOffsetX = 0;
      this.createPlatform(group, x + wallOffsetX, y + offsetY, "wall-left");
      wallOffsetX += 115;
      for (let i = 0; i < width; i++) {
        this.createPlatform(group, x + wallOffsetX, y + offsetY, "wall");
        wallOffsetX += 120;
      }
      this.createPlatform(group, x + wallOffsetX, y + offsetY, "wall-right");
      offsetY += 60;
    }
  }

  createPlatform(group, x, y, key) {
    /** @type {Phaser.Physics.Arcade.Sprite} */
    const platform = group.create(x, y, key);
    platform.setOrigin(0, 0);
    platform.body.updateFromGameObject();
    if (key === "floor") {
      platform.body.setSize(120, 54);
      platform.body.setOffset(0, 12);
    } else if (key === "floor-left") {
      platform.body.setSize(115, 54);
      platform.body.setOffset(9, 12);
    } else if (key === "floor-right") {
      platform.body.setSize(110, 54);
      platform.body.setOffset(0, 12);
    } else if (key === "wall") {
      platform.body.setSize(120, 60);
      platform.body.setOffset(0, 0);
    } else if (key === "wall-left") {
      platform.body.setSize(120, 60);
      platform.body.setOffset(9, 0);
    } else if (key === "wall-right") {
      platform.body.setSize(120, 60);
      platform.body.setOffset(0, 0);
    }
    return platform;
  }

  createEntities() {
    const entities = {};
    Object.entries(Entities).forEach(([entityName, entityData]) => {
      entities[entityName] = this.physics.add
        .sprite(entityData.x, entityData.y, entityData.sprite)
        .setOrigin(0, 1);

      if (entityData.quiz) {
        entities[entityName].aura = this.physics.add.existing(
          this.add
            .rectangle(
              entities[entityName].getBounds().x - 60,
              entities[entityName].getBounds().y - 60,
              entities[entityName].getBounds().width + 120,
              entities[entityName].getBounds().height + 60,
              0xff0000,
              0
            )
            .setOrigin(0, 0)
        );
        this.physics.add.overlap(this.player, entities[entityName].aura);
      }

      if (entityData.quiz) {
        entities[entityName].quiz = entityData.quiz;
        entities[entityName].quizState = {
          answered: false,
          solved: false,
          gameObjects: null,
          currentLine: null,
        };
      }

      if (entityData.colliders) {
        entities[entityName].colliders = [];
        entityData.colliders.forEach((collider) => {
          const colliderBody = this.physics.add.existing(
            this.add
              .rectangle(
                collider.x,
                collider.y,
                collider.width,
                collider.height,
                0x0000ff,
                0
              )
              .setOrigin(0, 1),
            true
          );
          this.physics.add.collider(this.player, colliderBody);
          entities[entityName].colliders.push(colliderBody);
        });
      }
    });
    this.entities = entities;
  }

  /**
   * @param {Phaser.Physics.Arcade.Sprite} quizEntity
   */
  showQuiz(quizEntity) {
    const container = this.add.container(
      quizEntity.getBounds().x,
      quizEntity.getBounds().y
    );
    const questionBubble = this.add.image(0, 0, "bubble-line").setOrigin(0, 0);
    const questionText = this.add
      .text(15, questionBubble.getBounds().centerY, quizEntity.quiz.quiestion, {
        fontFamily: "DigitalStrip",
        fontSize: 16,
        lineSpacing: 10,
        color: "#000",
      })
      .setOrigin(0, 0.5);
    container.add(questionBubble);
    container.add(questionText);
    let offsetX = 0;
    let offsetY = questionBubble.getBounds().height + 15;

    const answers = [];
    quizEntity.quiz.answers.forEach((answer, answerIndex) => {
      const answerBubble = this.add
        .image(offsetX, offsetY, `answer-bubble-${answerIndex + 1}`)
        .setOrigin(0, 0);
      const answerNumberText = this.add
        .text(
          offsetX + 15,
          offsetY + Math.round(answerBubble.getBounds().height / 2),
          answerIndex + 1,
          {
            fontFamily: "DigitalStrip",
            fontSize: 16,
            lineSpacing: 10,
            color: "#666",
          }
        )
        .setOrigin(0, 0.5);
      const answerText = this.add
        .text(
          offsetX + answerNumberText.getBounds().width + 30,
          offsetY + Math.round(answerBubble.getBounds().height / 2),
          answer,
          {
            fontFamily: "DigitalStrip",
            fontSize: 16,
            lineSpacing: 10,
            color: "#000",
          }
        )
        .setOrigin(0, 0.5);
      container.add(answerBubble);
      container.add(answerNumberText);
      container.add(answerText);
      if ((answerIndex + 1) % 2 === 1) {
        offsetX += answerBubble.getBounds().width + 15;
      } else {
        offsetX = 0;
        offsetY += answerBubble.getBounds().height + 15;
      }
      answers.push({
        answerBubble: answerBubble,
        answerNumberText: answerNumberText,
        answerText: answerText,
      });
    });
    container.setPosition(
      quizEntity.getBounds().centerX - container.getBounds().width / 2,
      quizEntity.getBounds().y - container.getBounds().height - 25
    );
    quizEntity.quizState.gameObjects = {
      container: container,
      questionBubble: questionBubble,
      questionText: questionText,
      answers: answers,
    };
  }

  answerQuiz(quizEntity, number) {
    if (quizEntity.quiz.correctNumber === number) {
      quizEntity.quizState.answered = true;
      quizEntity.quizState.solved = true;
      quizEntity.quizState.gameObjects.answers[number - 1].answerText.setColor(
        "#3F3"
      );
      console.log("correct!");
    } else {
      quizEntity.quizState.answered = true;
      quizEntity.quizState.gameObjects.answers[number - 1].answerText.setColor(
        "#F33"
      );
      console.log("fail!!!");
    }
    setTimeout(() => {
      this.advanceDialogue(quizEntity);
      this.playerFlags.quizDialogue = true;
    }, 1500);
  }

  advanceDialogue(quizEntity) {
    console.log("advanceDialogue start");
    if (quizEntity.quizState.gameObjects) {
      console.log("cleanup gameObjects");
      // cleanup previous text bubbles
      quizEntity.quizState.gameObjects.container.destroy();
      quizEntity.quizState.gameObjects = null;
    }
    let lines = quizEntity.quizState.solved
      ? quizEntity.quiz.correctAnswerLines
      : quizEntity.quiz.wrongAnswerLines;
    let currentLine =
      quizEntity.quizState.currentLine == null
        ? 0
        : quizEntity.quizState.currentLine;
    if (lines && lines.length > currentLine) {
      const line = lines[currentLine];
      console.log(`showSpeech ${currentLine}`);
      this.showSpeech(quizEntity, line);
      quizEntity.quizState.currentLine = currentLine + 1;
    } else {
      console.log("set FREE_MOVE");
      this.playerFlags.quizDialogue = false;
    }
    console.log("advanceDialogue end");
  }

  showSpeech(quizEntity, line) {
    const container = this.add.container(
      quizEntity.getBounds().x,
      quizEntity.getBounds().y
    );
    const lineText = this.add
      .text(15, 0, line, {
        fontFamily: "DigitalStrip",
        fontSize: 16,
        lineSpacing: 10,
        color: "#000",
        wordWrap: { width: 385, useAdvancedWrap: true },
      })
      .setOrigin(0, 0.5);
    const bubbleSpriteKey =
      lineText.getBounds().height < 38
        ? "bubble-line"
        : lineText.getBounds().height < 86
        ? "bubble-speech"
        : "bubble-speech-large";
    const textOffsetY =
      lineText.getBounds().height < 38
        ? 0
        : lineText.getBounds().height < 86
        ? -20
        : -35;
    const lineBubble = this.add.image(0, 0, bubbleSpriteKey).setOrigin(0, 0);
    lineText.setPosition(25, lineBubble.getBounds().centerY + textOffsetY);
    container.add(lineBubble);
    container.add(lineText);
    container.setPosition(
      quizEntity.getBounds().centerX - container.getBounds().width / 2,
      quizEntity.getBounds().y - container.getBounds().height - 25
    );
    quizEntity.quizState.gameObjects = {
      container: container,
      lineBubble: lineBubble,
      lineText: lineText,
    };
  }

  handleInput() {
    const questEntity = this.activeQuestEntityName
      ? this.entities[this.activeQuestEntityName]
      : null;
    const quizEntity = this.activeQuizEntityName
      ? this.entities[this.activeQuizEntityName]
      : null;

    if (this.playerFlags.canMove) {
      if (
        this.cursors.left.isDown ||
        this.keyA.isDown ||
        this.touchState.left
      ) {
        if (!this.player.body.blocked.left) {
          this.player.setVelocityX(-500);
          this.checkFlip(this.player);
        }
      } else if (
        this.cursors.right.isDown ||
        this.keyD.isDown ||
        this.touchState.right
      ) {
        if (!this.player.body.blocked.right) {
          this.player.setVelocityX(500);
          this.checkFlip(this.player);
        }
      } else {
        this.player.setVelocityX(0);
      }
      if (
        (this.cursors.up.isDown || this.keyW.isDown || this.touchState.jump) &&
        this.player.body.blocked.down
      ) {
        this.player.setVelocityY(-1200);
      }
      if (Phaser.Input.Keyboard.JustDown(this.cursors.space)) {
        if (
          questEntity &&
          questEntity.quizState &&
          !questEntity.quizState.answered
        ) {
          this.player.setVelocityX(0);
          this.activeQuizEntityName = this.activeQuestEntityName;
          this.playerFlags.quizQuestion = true;
          this.showQuiz(questEntity);
        }
      }
    }
    if (this.playerFlags.quizQuestion) {
      if (quizEntity && !quizEntity.quizState.answered) {
        [1, 2, 3, 4].forEach((number) => {
          if (Phaser.Input.Keyboard.JustDown(this[`key${number}`])) {
            this.answerQuiz(quizEntity, number);
          }
        });
      }
    }
    if (this.playerFlags.quizDialogue) {
      if (quizEntity) {
        if (Phaser.Input.Keyboard.JustDown(this.cursors.space)) {
          this.advanceDialogue(quizEntity);
        }
      }
    }

    if (
      Phaser.Input.Keyboard.JustDown(this.keyPlus) ||
      (this.keyPlus.isDown &&
        !Phaser.Input.Keyboard.DownDuration(this.keyPlus, 500))
    ) {
      this.cameras.main.zoom += 0.1;
      this.shouldResizeStaticObjects = true;
    } else if (
      Phaser.Input.Keyboard.JustDown(this.keyMinus) ||
      (this.keyMinus.isDown &&
        !Phaser.Input.Keyboard.DownDuration(this.keyMinus, 500))
    ) {
      this.cameras.main.zoom -= 0.1;
      this.shouldResizeStaticObjects = true;
    }

    if (Phaser.Input.Keyboard.JustDown(this.keyF)) {
      if (this.physics.world.drawDebug) {
        this.physics.world.drawDebug = false;
        this.physics.world.debugGraphic.clear();
      } else {
        this.physics.world.drawDebug = true;
      }
    }
  }

  update() {
    if (this.player.body.velocity.y < 0) {
      this.player.play("jump", true);
    } else if (this.player.body.velocity.y > 0) {
      this.player.play("fall", true);
    } else {
      if (Math.abs(this.player.body.velocity.x) > 0) {
        this.player.play("run", true);
      } else {
        this.player.play("still", true);
      }
    }

    let questEntityName = null;
    let showQuest = false;
    Object.entries(this.entities).forEach(([entityName, entity]) => {
      if (
        entity.aura &&
        !entity.aura.body.touching.none &&
        this.activeQuizEntityName !== entityName &&
        entity.quizState &&
        !entity.quizState.answered
      ) {
        showQuest = true;
        questEntityName = entityName;
      }
    });

    if (showQuest) {
      this.quest.setPosition(
        this.player.getBounds().centerX,
        this.player.getBounds().top - 20
      );
    }
    if (this.quest.visible !== showQuest) {
      this.quest.setVisible(showQuest);
    }
    if (this.activeQuestEntityName !== questEntityName) {
      this.activeQuestEntityName = questEntityName;
    }

    this.bg.mountains.setTilePosition(this.cameras.main.scrollX * 0.5, 0);

    if (
      this.cameras.main.worldView.width > 0 &&
      this.shouldResizeStaticObjects
    ) {
      this.resizeStaticObjects();
      this.shouldResizeStaticObjects = false;
    }

    this.debugText.setText([
      `safeAreaLeft: ${this.safeAreaLeft}`,
      `safeAreaRight: ${this.safeAreaRight}`,
      `window.innerWidth: ${window.innerWidth}`,
      `window.innerHeight: ${window.innerHeight}`,
    ]);

    if (this.isMobile && !this.controls.layer.visible) {
      this.controls.layer.setVisible(true);
    } else if (!this.isMobile && this.controls.layer.visible) {
      this.controls.layer.setVisible(false);
    }

    this.handleInput();
  }

  resizeStaticObjects() {
    console.log("resizeStaticObjects");
    const camZoom = this.cameras.main.zoom;
    const camWidth = Math.ceil(this.cameras.main.worldView.width);
    const camHeight = Math.ceil(this.cameras.main.worldView.height);
    const unscaledWidth = Math.ceil(camWidth * camZoom);
    const unscaledHeight = Math.ceil(camHeight * camZoom);
    const topX = Math.round((unscaledWidth - camWidth) / 2);
    const topY = Math.round((unscaledHeight - camHeight) / 2);

    // console.log("camZoom:", camZoom);
    // console.log("camWidth:", camWidth);
    // console.log("camHeight:", camHeight);
    // console.log("unscaledWidth:", unscaledWidth);
    // console.log("unscaledHeight:", unscaledHeight);
    // console.log("topX:", topX);
    // console.log("topY:", topY);

    this.debugText.setPosition(topX + 10, topY + 10);

    this.bg.mountains.setSize(camWidth, this.bg.mountains.height);
    this.bg.mountains.setPosition(topX, this.bg.mountains.y);

    this.controls.layer.each((item) => {
      item.setScale(0.5 / camZoom);
    });
    this.controls.left.setPosition(
      topX + this.safeAreaLeft * camZoom + 32,
      topY + camHeight - 32
    );
    this.controls.right.setPosition(
      topX +
        this.safeAreaLeft * camZoom +
        32 +
        this.controls.left.displayWidth +
        32,
      topY + camHeight - 32
    );
    this.controls.jump.setPosition(
      topX + camWidth - this.safeAreaRight * camZoom - 32,
      topY + camHeight - 32
    );
    this.controls.speak.setPosition(
      topX + camWidth - this.safeAreaRight * camZoom - 32,
      topY + camHeight - 32 - this.controls.jump.displayHeight - 32
    );
  }

  checkFlip(sprite) {
    if (sprite.body.velocity.x < 0) {
      sprite.setFlipX(false);
    } else {
      sprite.setFlipX(true);
    }
  }

  createControls() {
    const controlsLayer = this.add.layer();
    const left = this.add.image(0, 0, "control-left").setOrigin(0, 1);
    const right = this.add.image(0, 0, "control-right").setOrigin(0, 1);
    const jump = this.add.image(0, 0, "control-jump").setOrigin(1, 1);
    const speak = this.add.image(0, 0, "control-speak").setOrigin(1, 1);
    controlsLayer.add([left, right, jump, speak]);
    controlsLayer.each((item) => {
      item.setScrollFactor(0, 0);
      item.setInteractive();
    });
    controlsLayer.setDepth(layers.CONTROLS);
    const buttons = { left, right, jump, speak };
    Object.entries(buttons).forEach(([keyName, key]) => {
      key.on("pointerdown", () => {
        key.setAlpha(0.5);
        this.touchState[keyName] = true;
      });
      key.on("pointerup", () => {
        key.setAlpha(1);
        this.touchState[keyName] = false;
      });
    });
    this.controls = { layer: controlsLayer, left, right, jump, speak };
  }
}
