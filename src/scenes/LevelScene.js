import PlayerStates from '../PlayerStates';
import Entities from '../Entities';

export default class LevelScene extends Phaser.Scene {
  constructor() {
    super('level-scene');
  }

  create() {
    window.levelscene = this;

    this.cameras.main.setBounds(0, 0, 8000, 1080);
    this.physics.world.setBounds(0, 0, 8000, 1080);
    this.physics.world.setBoundsCollision(false, true, false, false);

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

    this.key1 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ONE);
    this.key2 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.TWO);
    this.key3 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.THREE);
    this.key4 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.FOUR);

    this.activeQuestEntityName = null;
    this.activeQuizEntityName = null;

    this.playerState = PlayerStates.FREE_MOVE;
  }

  createPlayer() {
    const player = this.physics.add.sprite(930, 70);
    player.body.setSize(85, 99);
    player.body.setOffset(24, 20);
    player.setCollideWorldBounds(true);
    player.setAccelerationY(2000);

    this.anims.create({
      key: 'still',
      frames: this.anims.generateFrameNumbers('player', {
        frames: [15],
      }),
      repeat: -1,
    });
    this.anims.create({
      key: 'jump',
      frames: this.anims.generateFrameNumbers('player', {
        frames: [14],
      }),
      repeat: -1,
    });
    this.anims.create({
      key: 'fall',
      frames: this.anims.generateFrameNumbers('player', {
        frames: [9],
      }),
      repeat: -1,
    });
    this.anims.create({
      key: 'run',
      frames: this.anims.generateFrameNumbers('player', {
        frames: [0, 6, 7, 8, 10, 11, 12, 13, 4, 1, 2, 3, 5],
      }),
      repeat: -1,
    });

    player.play('still');

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
    this.createLargePlatform(platforms, 300, 200, 1); /** Место для самолюбования */
    this.createLargePlatform(platforms, 400, 580, 1); /** Под горой */
    this.createLargePlatform(platforms, 1000, 400, 2); /** Бабули */
    
    this.createLargePlatform(platforms, 2800, 300, 1); /** Свинка */
    this.createLargePlatform(platforms, 2410, 500, 1); /** Крыша библиотеки */

    this.createLargePlatform(platforms, 2200, 760, 3); /** Основание библиотеки */
    this.createLargePlatform(platforms, 3350, 350, 1); /** Крыша Яблока */

    this.createLargePlatform(platforms, 4000, 450, 1);
    this.createLargePlatform(platforms, 4500, 300, 2);
    this.createLargePlatform(platforms, 4500, 760, 1);
    this.createLargePlatform(platforms, 4950, 760, 1);
    this.createLargePlatform(platforms, 5500, 300, 1);
    this.createLargePlatform(platforms, 6000, 400, 2);
    this.createLargePlatform(platforms, 6700, 500, 1);
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
    Object.entries(Entities).forEach(([entityName, entityData]) => {
      entities[entityName] = this.physics.add
        .sprite(entityData.x, entityData.y, entityData.sprite)
        .setOrigin(0, 1);
      entities[entityName].aura = this.physics.add.existing(
        this.add
          .rectangle(
            entities[entityName].getBounds().x - 60,
            entities[entityName].getBounds().y - 60,
            entities[entityName].getBounds().width + 120,
            entities[entityName].getBounds().height + 60,
            0xff0000,
            0.0125
          )
          .setOrigin(0, 0)
      );
      if (entityData.quiz) {
        entities[entityName].quiz = entityData.quiz;
        entities[entityName].quizState = {
          answered: false,
          solved: false,
          gameObjects: null,
          currentLine: null,
        };
      }
      this.physics.add.overlap(this.player, entities[entityName].aura);
    });
    return entities;
  }

  createClouds() {
    const clouds = this.physics.add.staticGroup();
    return clouds;
  }

  /**
   * @param {Phaser.Physics.Arcade.Sprite} quizEntity
   */
  showQuiz(quizEntity) {
    const container = this.add.container(quizEntity.getBounds().x, quizEntity.getBounds().y);
    const questionBubble = this.add.image(0, 0, 'bubble-line').setOrigin(0, 0);
    const questionText = this.add
      .text(15, questionBubble.getBounds().centerY, quizEntity.quiz.quiestion, {
        fontSize: 18,
        color: '#000',
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
          { fontSize: 18, color: '#666' }
        )
        .setOrigin(0, 0.5);
      const answerText = this.add
        .text(
          offsetX + answerNumberText.getBounds().width + 30,
          offsetY + Math.round(answerBubble.getBounds().height / 2),
          answer,
          { fontSize: 18, color: '#000' }
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
      quizEntity.quizState.gameObjects.answers[number - 1].answerText.setColor('#3F3');
      console.log('correct!');
    } else {
      quizEntity.quizState.answered = true;
      quizEntity.quizState.gameObjects.answers[number - 1].answerText.setColor('#F33');
      console.log('fail!!!');
    }
    setTimeout(() => {
      this.advanceDialogue(quizEntity);
      this.playerState = PlayerStates.QUIZ_DIALOGUE;
    }, 1500);
  }

  advanceDialogue(quizEntity) {
    console.log('advanceDialogue start');
    if (quizEntity.quizState.gameObjects) {
      console.log('cleanup gameObjects');
      // cleanup previous text bubbles
      quizEntity.quizState.gameObjects.container.destroy();
      quizEntity.quizState.gameObjects = null;
    }
    let lines = quizEntity.quizState.solved
      ? quizEntity.quiz.correctAnswerLines
      : quizEntity.quiz.wrongAnswerLines;
    let currentLine =
      quizEntity.quizState.currentLine == null ? 0 : quizEntity.quizState.currentLine;
    if (lines && lines.length > currentLine) {
      const line = lines[currentLine];
      console.log(`showSpeech ${currentLine}`);
      this.showSpeech(quizEntity, line);
      quizEntity.quizState.currentLine = currentLine + 1;
    } else {
      console.log('set FREE_MOVE');
      this.playerState = PlayerStates.FREE_MOVE;
    }
    console.log('advanceDialogue end');
  }

  showSpeech(quizEntity, line) {
    const container = this.add.container(quizEntity.getBounds().x, quizEntity.getBounds().y);
    const lineText = this.add
      .text(15, 0, line, {
        fontSize: 18,
        color: '#000',
        wordWrap: { width: 385, useAdvancedWrap: true },
      })
      .setOrigin(0, 0.5);
    const bubbleSpriteKey =
      lineText.getBounds().height < 38
        ? 'bubble-line'
        : lineText.getBounds().height < 86
        ? 'bubble-speech'
        : 'bubble-speech-large';
    const textOffsetY =
      lineText.getBounds().height < 38 ? 0 : lineText.getBounds().height < 86 ? -20 : -35;
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
    const quizEntity = this.activeQuizEntityName ? this.entities[this.activeQuizEntityName] : null;

    if (this.playerState === PlayerStates.FREE_MOVE) {
      if (this.cursors.left.isDown || this.keyA.isDown) {
        if (!this.player.body.blocked.left) {
          this.player.setVelocityX(-500);
          this.checkFlip(this.player);
        }
      } else if (this.cursors.right.isDown || this.keyD.isDown) {
        if (!this.player.body.blocked.right) {
          this.player.setVelocityX(500);
          this.checkFlip(this.player);
        }
      } else {
        this.player.setVelocityX(0);
      }
      if ((this.cursors.up.isDown || this.keyW.isDown) && this.player.body.blocked.down) {
        this.player.setVelocityY(-1200);
      }
      if (Phaser.Input.Keyboard.JustDown(this.cursors.space)) {
        if (questEntity && questEntity.quizState && !questEntity.quizState.answered) {
          this.player.setVelocityX(0);
          this.activeQuizEntityName = this.activeQuestEntityName;
          this.playerState = PlayerStates.QUIZ_QUESTION;
          this.showQuiz(questEntity);
        }
      }
    } else if (this.playerState === PlayerStates.QUIZ_QUESTION) {
      if (quizEntity && !quizEntity.quizState.answered) {
        [1, 2, 3, 4].forEach((number) => {
          if (Phaser.Input.Keyboard.JustDown(this[`key${number}`])) {
            this.answerQuiz(quizEntity, number);
          }
        });
      }
    } else if (this.playerState === PlayerStates.QUIZ_DIALOGUE) {
      if (quizEntity) {
        if (Phaser.Input.Keyboard.JustDown(this.cursors.space)) {
          this.advanceDialogue(quizEntity);
        }
      }
    }
  }

  update() {
    this.handleInput();

    if (this.player.body.velocity.y < 0) {
      this.player.play('jump', true);
    } else if (this.player.body.velocity.y > 0) {
      this.player.play('fall', true);
    } else {
      if (Math.abs(this.player.body.velocity.x) > 0) {
        this.player.play('run', true);
      } else {
        this.player.play('still', true);
      }
    }

    this.quest.setPosition(this.player.getBounds().centerX, this.player.getBounds().top - 20);

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
    if (this.quest.visible !== showQuest) {
      this.quest.setVisible(showQuest);
    }
    if (this.activeQuestEntityName !== questEntityName) {
      this.activeQuestEntityName = questEntityName;
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
