import Phaser from "phaser";
import Entities from "../Entities";

const VERTICAL_OFFSET = Math.ceil(1080 * 0.2);
const WORLD_WIDTH = 50520;
const WORLD_HEIGHT = 1080 + VERTICAL_OFFSET;

const DEPTH_BACKGROUND = 100;
const DEPTH_FLOOR = 110;
const DEPTH_PLATFORMS = 120;
const DEPTH_ENTITIES = 130;
const DEPTH_PLAYER = 180;
const DEPTH_QUEST = 150;
const DEPTH_CONTROLS = 160;
const DEPTH_BUBBLES = 170;

const DIALOG_ZOOM_AMOUNT = 0;
const DIALOG_ZOOM_DURATION = 500;
const DIALOG_ZOOM_EASING = "Cubic";

const JUMP_ZOOM_AMOUNT = -0.03;
const JUMP_ZOOM_DURATION = 800;
const JUMP_ZOOM_UP_EASING = "Cubic";
const JUMP_ZOOM_DOWN_EASING = "Linear";

const JUMP_ZOOM_AMOUNT_MOBILE = -0.15;
const JUMP_ZOOM_DURATION_MOBILE = 700;

function decl(value, words) {
  value = Math.abs(value) % 100;
  var num = value % 10;
  if (value > 10 && value < 20) return words[2];
  if (num > 1 && num < 5) return words[1];
  if (num == 1) return words[0];
  return words[2];
}

export default class LevelScene extends Phaser.Scene {
  constructor() {
    super("level-scene");
    window.levelscene = this;
  }

  create() {
    this.mainCamera = this.cameras.main;
    this.uiCamera = this.cameras.add(
      0,
      0,
      window.innerWidth,
      window.innerHeight,
      false,
      "ui"
    );

    this.isLandscape = false;
    this.isMobile = false;
    this.shouldResizeStaticObjects = true;
    this.nearbyEntityName = null;
    this.dialogZoom = 0;
    this.jumpZoom = 0;
    this.correctAnswers = 0;
    this.interactedObjects = 0;
    this.cloudsPosition = 0;

    this.physics.world.setBounds(0, 0, WORLD_WIDTH, WORLD_HEIGHT);
    this.physics.world.setBoundsCollision(true, true, false, true);
    this.mainCamera.setBounds(0, 0, WORLD_WIDTH, WORLD_HEIGHT);

    this.bgm = this.sound.add("bgm");
    this.bgm.setLoop(true);
    this.bgm.play();
    // this.bgm.stop();

    this.sfxRun = this.sound.add("sfx:run");
    this.sfxLand = this.sound.add("sfx:land");

    this.sfxQuizStart = this.sound.add("quiz-start");
    this.sfxQuizFail = this.sound.add("quiz-fail");
    this.sfxQuizSuccess = this.sound.add("quiz-success");

    this.nyancatBgm = this.sound.add("nyancat-bgm");
    this.nyancatBgm.setLoop(true);
    this.nyancatMode = false;

    this.createBackground();
    this.createFloor();
    this.createPlatforms();
    this.createPlayer();
    this.createEntities();
    this.createControls();

    this.years = [
      { sprite: 'before1994', x: 0 },
      { sprite: 'y1994', x: 1760 },
      { sprite: 'year_1995', x: 3370 },
      { sprite: 'y1996', x: 4520 },
      { sprite: 'y1997', x: 6100 },
      { sprite: 'y1998', x: 7600 },
      { sprite: 'y1999', x: 9680 },
      { sprite: 'year_2000', x: 10550 },
      { sprite: 'y2001', x: 12370 },
      { sprite: 'y2003', x: 13000 },
      { sprite: 'y2004', x: 13900 },
      { sprite: 'y2006', x: 16800 },
      { sprite: 'year_2007', x: 19600 },
      { sprite: 'y2009', x: 23500 },
      { sprite: 'year_2010', x: 27265 },
      { sprite: 'y2011', x: 27900 },
      { sprite: 'y2013', x: 30650 },
      { sprite: 'y2014', x: 31815 },
      { sprite: 'year_2016', x: 33310 },
      { sprite: 'y2019', x: 36380 },
      { sprite: 'year_2020', x: 37500 },
      { sprite: 'y2021', x: 46890 },
      { sprite: 'year_2022', x: 49388 },
    ];

    this.bubblesLayer = this.add.layer();
    this.staticBubblesLayer = this.add.layer();

    this.quest = this.add
      .sprite(0, 0, "quest")
      .setOrigin(0.5, 1)
      .setVisible(false);

    // this.pointerDebugText = this.add
    //   .rexBBCodeText({
    //     x: 0,
    //     y: 0,
    //     text: "debug",
    //     style: {
    //       fontFamily: "Onest",
    //       fontSize: 20,
    //       lineSpacing: 8,
    //       color: "#404",
    //       // wordWrap: { width: 400, useAdvancedWrap: true },
    //       wrap: {
    //         mode: "word",
    //         width: 400,
    //       },
    //       stroke: "#ffffff",
    //       strokeThickness: 4,
    //     },
    //   })
    //   .setOrigin(0, 0)
    //   .setDepth(9999)
    //   .setVisible(false);
    // this.pointerDebugX = this.add
    //   .line(0, 0, 0, 0, 0, 0, 0x00000, 1)
    //   .setOrigin(0, 0)
    //   .setDepth(9999)
    //   .setVisible(false);
    // this.pointerDebugY = this.add
    //   .line(0, 0, 0, 0, 0, 0, 0x00000, 1)
    //   .setOrigin(0, 0)
    //   .setDepth(9999)
    //   .setVisible(false);
    this.correctAnswersText = this.add
      .rexBBCodeText({
        x: 10,
        y: 10,
        text: "",
        style: {
          fontFamily: "ComicCat",
          fontSize: 24,
          lineSpacing: 8,
          color: "#000000",
          stroke: "#fff", // null, css string, or number
          strokeThickness: 6,
          // wordWrap: { width: 400, useAdvancedWrap: true },
          wrap: {
            mode: "word",
            width: 500,
          },
          padding: 5,
        },
      })
      .setOrigin(0, 0)
      .setDepth(9999)
      .setVisible(false);
    this.interactedObjectsText = this.add
      .rexBBCodeText({
        x: 15,
        y: 40,
        text: "Пройдено объектов: 0",
        style: {
          fontFamily: "ComicCat",
          fontSize: 24,
          lineSpacing: 8,
          color: "rgba(0, 0, 0, 0)",
          // wordWrap: { width: 400, useAdvancedWrap: true },
          wrap: {
            mode: "word",
            width: 400,
          },
          stroke: "#ffffff",
          strokeThickness: 4,
        },
      })
      .setOrigin(0, 0)
      .setDepth(9999);

    this.currentYear = this.add
      .sprite(0, 0, "before1994")
      .setOrigin(0.5, 1)
      .setScrollFactor(0, 1)
      .setDepth(DEPTH_ENTITIES);

    this.bg.layer.setDepth(DEPTH_BACKGROUND);
    this.floorLayer.setDepth(DEPTH_FLOOR);
    this.platformsLayer.setDepth(DEPTH_PLATFORMS);
    this.entitiesLayer.setDepth(DEPTH_ENTITIES);
    this.bubblesLayer.setDepth(DEPTH_BUBBLES);
    this.staticBubblesLayer.setDepth(DEPTH_BUBBLES);
    this.player.setDepth(DEPTH_PLAYER);
    this.quest.setDepth(DEPTH_QUEST);
    this.controls.layer.setDepth(DEPTH_CONTROLS);

    this.mainCamera.ignore([
      this.controls.layer,
      this.correctAnswersText,
      this.interactedObjectsText,
      this.staticBubblesLayer,
    ]);
    this.uiCamera.ignore([
      this.bg.layer,
      this.floorLayer,
      this.platformsLayer,
      this.entitiesLayer,
      this.bubblesLayer,
      this.player,
      this.quest,
      this.currentYear,
      // this.pointerDebugText,
      // this.pointerDebugX,
      // this.pointerDebugY,
      // this.physics.world.debugGraphic,
    ]);

    this.physics.add.collider(this.player, this.platformsGroup);
    this.physics.add.collider(this.player, this.floorGroup);

    this.cursors = this.input.keyboard.createCursorKeys();
    this.keyEnter = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.ENTER
    );
    this.keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    this.keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    this.keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
    this.keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    this.keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
    this.keyP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.P);

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

    this.touchState = {};

    this.playerFlags = {
      canMove: true,
    };

    // this.physics.world.drawDebug = false;
    // this.physics.world.debugGraphic.clear();

    this.safeAreaLeft = 0;
    this.safeAreaRight = 0;

    this.mainCamera.setBackgroundColor("#c5c5c5");

    window.localStorage.setItem("gameStarted", true);
    const gameContinue = window.localStorage.getItem("gameContinue");
    if (gameContinue) {
      window.localStorage.removeItem("gameContinue");
      this.loadProgress();
    }

    this.mainCamera.centerOn(this.player.x, this.player.y);
    this.mainCamera.startFollow(this.player, true, 0.08, 1);

    const catBounds = this.entities.cat.getBounds();
    this.entities.cat.nyancatArea = this.physics.add.existing(
      this.add
        .rectangle(
          catBounds.left,
          catBounds.bottom - 5,
          catBounds.width,
          700,
          0xff0000,
          0
        )
        .setOrigin(0, 1)
    );
    this.physics.add.overlap(this.player, this.entities.cat.nyancatArea);

    this.events.on("resize", () => {
      this.onResize();
    });
    this.events.once("postupdate", () => {
      this.events.once("postupdate", () => {
        this.onResize();
        this.updateCameraFollowOffset();
      });
    });
  }

  updateCameraFollowOffset() {
    // this.events.once("postupdate", () => {
    //   const entity = this.nearbyEntityName
    //     ? this.entities[this.nearbyEntityName]
    //     : null;
    //   const hasActiveBubbles =
    //     entity &&
    //     (entity.quizState?.shown ||
    //       entity.popupState?.shown ||
    //       entity.dialogueState?.shown);
    //   let offsetY = 0;
    //   if (this.isMobile && !hasActiveBubbles) {
    //     offsetY = Math.round(this.mainCamera.worldView.height * -0.2);
    //   } else if (!this.isMobile && !hasActiveBubbles) {
    //     offsetY = Math.round(this.mainCamera.worldView.height * -0.2);
    //   }
    //   if (this.mainCamera.followOffset.y !== offsetY) {
    //     this.mainCamera.setFollowOffset(0, offsetY);
    //   }
    // });
  }

  onResize() {
    if (!this.cameras.main) {
      return;
    }

    this.isLandscape = window.innerWidth > window.innerHeight;
    this.isMobile = this.isLandscape && window.innerWidth <= 896;

    this.mainCamera.zoom = this.getFullZoom();

    this.updateCameraFollowOffset();

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

  getFullZoom() {
    return this.getScaledZoom() + this.dialogZoom + this.jumpZoom;
  }

  getScaledZoom() {
    return (
      Math.round((window.innerHeight / 1080) * (this.isMobile ? 2 : 1) * 128) /
      128
    );
  }

  createPlayer() {
    const player = this.physics.add.sprite(2200, 550 + VERTICAL_OFFSET);
    player.body.setSize(40, 200);
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
    this.anims.create({
      key: "thinking",
      frames: this.anims.generateFrameNumbers("player", {
        frames: [12],
      }),
      repeat: -1,
    });

    player.play("still");

    this.player = player;
  }

  /**
   * @returns {Phaser.Physics.Arcade.StaticGroup}
   */
  createFloor() {
    const layer = this.add.layer();
    const group = this.physics.add.staticGroup();
    this.floorLayer = layer;
    this.floorGroup = group;
    this.createLargePlatform(layer, group, 0, 930, 419);
  }

  createBackground() {
    const bgLayer = this.add.layer();
    const bg1 = this.add
      .tileSprite(
        0,
        WORLD_HEIGHT,
        window.innerWidth,
        this.textures.get("bg-layer-1").getSourceImage().height,
        "bg-layer-1"
      )
      .setOrigin(0, 1)
      .setScrollFactor(0, 1);
    const bg2 = this.add
      .tileSprite(
        0,
        WORLD_HEIGHT - 100,
        window.innerWidth,
        this.textures.get("bg-layer-2").getSourceImage().height,
        "bg-layer-2"
      )
      .setOrigin(0, 1)
      .setScrollFactor(0, 1);
    const bg3 = this.add
      .tileSprite(
        0,
        WORLD_HEIGHT,
        window.innerWidth,
        this.textures.get("bg-layer-3").getSourceImage().height,
        "bg-layer-3"
      )
      .setOrigin(0, 1)
      .setScrollFactor(0, 1);
    const clouds = this.add
      .tileSprite(
        0,
        WORLD_HEIGHT - 515,
        window.innerWidth,
        this.textures.get("clouds").getSourceImage().height,
        "clouds"
      )
      .setOrigin(0, 1)
      .setScrollFactor(0, 1);
    bgLayer.add([clouds, bg3, bg2, bg1]);
    this.bg = {
      layer: bgLayer,
      clouds,
      bg3,
      bg2,
      bg1,
    };
  }

  createPlatforms() {
    const layer = this.add.layer();
    const group = this.physics.add.staticGroup();
    this.platformsLayer = layer;
    this.platformsGroup = group;
    this.createLargePlatform(
      layer,
      group,
      310,
      190,
      1
    ); /** Место для самолюбования */

    this.createLargePlatform(layer, group, 1140, 400, 2); /** Бабули */

    this.createLargePlatform(layer, group, 3050, 300, 1); /** Свинка */
    this.createLargePlatform(layer, group, 5060, 200, 1); /** Тетрис */

    this.createLargePlatform(layer, group, 5800, 400, 2); /** Касперский */
    this.createLargePlatform(layer, group, 6600, 600, 2); /** Около Рифа */

    this.createLargePlatform(layer, group, 7400, 350, 1); /** Мейл.ру */
    this.createLargePlatform(layer, group, 8050, 190, 1); /** Гопники */
    this.createLargePlatform(layer, group, 8700, 250, 1); /** Телевизор */
    this.createLargePlatform(
      layer,
      group,
      9500,
      450,
      1
    ); /** Интернет Эксплорер */
    this.createLargePlatform(layer, group, 10250, 250, 1); /** Живой журнал */
    this.createLargePlatform(layer, group, 10900, 510, 1); /** Ру центр */
    this.createLargePlatform(layer, group, 11600, 650, 1); /** Яндекс */
    this.createLargePlatform(layer, group, 13300, 650, 1); /** Кинопоиск */
    this.createLargePlatform(layer, group, 12170, 350, 1); /** Википедиа */
    this.createLargePlatform(layer, group, 12850, 350, 1); /** Мамба */
    this.createLargePlatform(layer, group, 14600, 650, 1); /** Лепрозорий */
    this.createLargePlatform(
      layer,
      group,
      14690,
      135,
      1
    ); /** Маска анонимуса */
    this.createLargePlatform(layer, group, 16480, 500, 4); /** Хабр */
    this.createLargePlatform(layer, group, 18200, 440, 1); /** Одноклассники */
    this.createLargePlatform(layer, group, 18900, 290, 1); /** Тэглайн */
    this.createLargePlatform(layer, group, 19600, 480, 1); /** На пенёк сел */
    this.createLargePlatform(layer, group, 20600, 400, 2); /** Упячка */
    this.createLargePlatform(layer, group, 21500, 300, 2);
    this.createLargePlatform(layer, group, 22400, 500, 2); /** Путин краб */
    this.createLargePlatform(layer, group, 23300, 340, 2); /** Госуслуги */
    this.createLargePlatform(layer, group, 24400, 340, 2); /** Трольфейс */
    this.createLargePlatform(layer, group, 25250, 480, 1);
    this.createLargePlatform(layer, group, 26300, 500, 1); /** Точка рф */
    this.createLargePlatform(layer, group, 29100, 520, 1);
    this.createLargePlatform(layer, group, 29770, 700, 3); /** Тян РНК */
    this.createLargePlatform(layer, group, 29700, 250, 1); /** Лиса */
    this.createLargePlatform(layer, group, 30430, 130, 1); /** Язь */
    this.createLargePlatform(layer, group, 31100, 130, 1); /** Адвокат */
    this.createLargePlatform(layer, group, 31680, 350, 1); /** Медуза */
    this.createLargePlatform(layer, group, 32400, 630, 1); /** Золотой сайт */
    this.createLargePlatform(layer, group, 32900, 340, 1);
    this.createLargePlatform(layer, group, 33600, 340, 1); /** Алиса */
    this.createLargePlatform(
      layer,
      group,
      34300,
      180,
      1
    ); /** Иностранный агент */
    this.createLargePlatform(layer, group, 34900, 450, 5); /** Удалёнщик */
    this.createLargePlatform(layer, group, 38060, 332, 1);
    this.createLargePlatform(layer, group, 38750, 520, 2); /** Малыш йода */
    this.createLargePlatform(layer, group, 44550, 480, 4); /** Иронов */
    this.createLargePlatform(
      layer,
      group,
      46550,
      500,
      3
    ); /** Электронное голосование */
    this.createLargePlatform(
      layer,
      group,
      47480,
      620,
      2
    ); /** Банк беспокоит> */
    this.createLargePlatform(
      layer,
      group,
      48330,
      430,
      2
    ); /** Банк беспокоит> */
  }

  createLargePlatform(layer, group, x, y, width = 0, height = 0) {
    let offsetX = 0;
    let offsetY = 0;
    this.createPlatform(layer, group, x + offsetX, y + offsetY, "floor-left");
    offsetX += 115;
    for (let i = 0; i < width; i++) {
      this.createPlatform(layer, group, x + offsetX, y + offsetY, "floor");
      offsetX += 120;
    }
    this.createPlatform(layer, group, x + offsetX, y + offsetY, "floor-right");
    offsetY += 66;

    for (let i = 0; i < height; i++) {
      let wallOffsetX = 0;
      this.createPlatform(
        layer,
        group,
        x + wallOffsetX,
        y + offsetY,
        "wall-left"
      );
      wallOffsetX += 115;
      for (let i = 0; i < width; i++) {
        this.createPlatform(layer, group, x + wallOffsetX, y + offsetY, "wall");
        wallOffsetX += 120;
      }
      this.createPlatform(
        layer,
        group,
        x + wallOffsetX,
        y + offsetY,
        "wall-right"
      );
      offsetY += 60;
    }
  }

  createPlatform(layer, group, x, y, key) {
    /** @type {Phaser.Physics.Arcade.Sprite} */
    const platform = group.create(x, y + VERTICAL_OFFSET, key);
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
    layer.add(platform);
    return platform;
  }

  createEntities() {
    const entitiesLayer = this.add.layer();
    const entities = {};
    const entitiesSounds = {};

    Object.entries(Entities).forEach(([entityName, entityData]) => {
      let entity;

      const createAnims = (sprite, atlas, frame, name) => {
        this.anims.create({
          key: `${sprite}_${name}`,
          frames: this.anims.generateFrameNames(atlas, {
            prefix: sprite,
            suffix: ".png",
            start: frame.start,
            end: frame.end,
          }),
          yoyo: frame.yoyo ?? true,
          repeat: frame.repeat ?? -1,
          repeatDelay: frame.repeatDelay ?? 5000,
          frameRate: frame.rate ?? 1,
        });
      };

      if (entityData.frame) {
        createAnims(
          entityData.sprite,
          entityData.atlas,
          entityData.frame,
          "animation"
        );
        entity = this.physics.add.sprite(
          entityData.x,
          entityData.y + VERTICAL_OFFSET,
          entityData.atlas
        );
        if (entityData.portal) {
          createAnims(
            entityData.sprite,
            entityData.atlas,
            entityData.portal.stillFrame,
            "still"
          );
          createAnims(
            entityData.sprite,
            entityData.atlas,
            entityData.portal.enterFrame,
            "enter"
          );
          createAnims(
            entityData.sprite,
            entityData.atlas,
            entityData.portal.leaveFrame,
            "leave"
          );
          entity.play(`${entityData.sprite}_still`);
        } else {
          entity.play(`${entityData.sprite}_animation`);
        }
      } else {
        entity = this.physics.add
          .sprite(
            entityData.x,
            entityData.y + VERTICAL_OFFSET,
            entityData.sprite
          )
          .setOrigin(0, 1);
      }

      entityData.scale && entity.setScale(entityData.scale);

      if (entityData.sound) {
        const soundInstance = this.sound.add(entityData.sound.key);
        entitiesSounds[entityName] = soundInstance;
        entity.soundData = entityData.sound;
        entity.soundState = {
          played: false,
          skipNext: true,
        };
        entity.soundInstance = soundInstance;
      }

      if (entityData.quiz) {
        entity.quizArea = this.physics.add.existing(
          this.add
            .rectangle(
              entityData.quiz.area.x,
              entityData.quiz.area.y + VERTICAL_OFFSET,
              entityData.quiz.area.width,
              entityData.quiz.area.height,
              0xff0000,
              0
            )
            .setOrigin(
              entityData.quiz.area.origin?.x ?? 0,
              entityData.quiz.area.origin?.y ?? 0
            )
        );
        this.physics.add.overlap(this.player, entity.quizArea);

        entity.quizData = entityData.quiz;
        entity.quizState = {
          started: false,
          shown: false,
          answered: false,
          solved: false,
          gameObjects: null,
          currentLine: null,
          finished: false,
        };
      }

      if (entityData.popup) {
        entity.popupArea = this.physics.add.existing(
          this.add
            .rectangle(
              entityData.popup.area.x,
              entityData.popup.area.y + VERTICAL_OFFSET,
              entityData.popup.area.width,
              entityData.popup.area.height,
              0xffff00,
              0
            )
            .setOrigin(
              entityData.popup.area.origin?.x ?? 0,
              entityData.popup.area.origin?.y ?? 0
            )
        );
        this.physics.add.overlap(this.player, entity.popupArea);

        entity.popupData = entityData.popup;
        entity.popupState = {
          shown: false,
          gameObjects: null,
        };
      }

      if (entityData.dialogue) {
        entity.dialogueArea = this.physics.add.existing(
          this.add
            .rectangle(
              entityData.dialogue.area.x,
              entityData.dialogue.area.y + VERTICAL_OFFSET,
              entityData.dialogue.area.width,
              entityData.dialogue.area.height,
              0xffff00,
              0
            )
            .setOrigin(
              entityData.dialogue.area.origin?.x ?? 0,
              entityData.dialogue.area.origin?.y ?? 0
            )
        );
        this.physics.add.overlap(this.player, entity.dialogueArea);

        entity.dialogueData = entityData.dialogue;
        entity.dialogueState = {
          started: false,
          shown: false,
          gameObjects: null,
          currentLine: null,
          isPlayer: false,
          finished: false,
        };
      }

      if (entityData.colliders) {
        entity.colliders = [];
        entityData.colliders.forEach((collider) => {
          const colliderBody = this.physics.add.existing(
            this.add
              .rectangle(
                collider.x,
                collider.y + VERTICAL_OFFSET,
                collider.width,
                collider.height,
                0x0000ff,
                0
              )
              .setOrigin(0, 1),
            true
          );
          this.physics.add.collider(this.player, colliderBody);
          entity.colliders.push(colliderBody);
        });
      }

      if (entityData.exit) {
        entity.exitArea = this.physics.add.existing(
          this.add
            .rectangle(
              entityData.exit.area.x,
              entityData.exit.area.y + VERTICAL_OFFSET,
              entityData.exit.area.width,
              entityData.exit.area.height,
              0xff0000,
              0
            )
            .setOrigin(
              entityData.exit.area.origin?.x ?? 0,
              entityData.exit.area.origin?.y ?? 0
            )
        );
        this.physics.add.overlap(this.player, entity.exitArea);

        entity.exitData = entityData.exit;
        entity.exitState = {
          started: false,
          shown: false,
          gameObjects: null,
        };
      }

      if (entityData.portal) {
        entity.portalArea = this.physics.add.existing(
          this.add
            .rectangle(
              entityData.portal.area.x,
              entityData.portal.area.y + VERTICAL_OFFSET,
              entityData.portal.area.width,
              entityData.portal.area.height,
              0xff0000,
              0
            )
            .setOrigin(
              entityData.portal.area.origin?.x ?? 0,
              entityData.portal.area.origin?.y ?? 0
            )
        );
        this.physics.add.overlap(this.player, entity.portalArea);

        entity.portalData = {
          ...entityData.portal,
          sprite: entityData.sprite,
        };
        entity.portalState = {
          interacted: false,
        };
      }

      entities[entityName] = entity;
      entitiesLayer.add(entity);
    });
    this.entities = entities;
    this.entitiesLayer = entitiesLayer;
    this.entitiesSounds = entitiesSounds;
  }

  /**
   * @param {Phaser.Physics.Arcade.Sprite} entity
   */
  showQuiz(entity) {
    if (!entity.quizState.interacted) {
      entity.quizState.interacted = true;
      this.interactedObjects++;
      this.interactedObjectsText.text = `Interacted objects: ${this.interactedObjects}`;
    }
    const container = this.add.container(0, 0);
    const questionText = this.add
      .rexBBCodeText({
        x: 0,
        y: 0,
        text: entity.quizData.quiestion,
        style: {
          fontFamily: "ComicCat",
          fontSize: 28,
          lineSpacing: 10,
          color: "#000000",
          stroke: "#fff", // null, css string, or number
          strokeThickness: 5,
          wrap: {
            mode: "word",
            width: 644,
          },
          padding: 5,
        },
      })
      .setOrigin(0, 0);
    container.add(questionText);
    const answersTop = questionText.getBounds().bottom + 15;
    let offsetX = 0;
    let offsetY = answersTop;

    const answers = [];
    entity.quizData.answers.forEach((answer, answerIndex) => {
      const answerBubble = this.add
        .image(offsetX, offsetY, `answer-${answerIndex + 1}`)
        .setOrigin(0, 0);
      const answerNumberText = this.add
        .rexBBCodeText({
          x: offsetX + 15,
          y: offsetY + Math.round(answerBubble.getBounds().height / 2),
          text: answerIndex + 1,
          style: {
            fontFamily: "Onest",
            fontSize: 16,
            lineSpacing: 4,
            color: "#E13914",
          },
        })
        .setOrigin(0, 0.5);
      const answerText = this.add
        .rexBBCodeText({
          x: offsetX + answerNumberText.getBounds().width + 30,
          y: offsetY + Math.round(answerBubble.getBounds().height / 2),
          text: answer,
          style: {
            fontFamily: "Onest",
            fontSize: 16,
            lineSpacing: 4,
            color: "#000000",
          },
        })
        .setOrigin(0, 0.5);
      container.add(answerBubble);
      container.add(answerNumberText);
      container.add(answerText);
      if ((answerIndex + 1) % 2 === 1) {
        offsetY += answerBubble.getBounds().height + 15;
      } else {
        offsetY = answersTop;
        offsetX += answerBubble.getBounds().width + 15;
      }
      answerBubble.setInteractive();
      answerBubble.on("pointerdown", () => {
        this.touchState[`answer${answerIndex + 1}`] = true;
      });
      answers.push({
        answerBubble: answerBubble,
        answerNumberText: answerNumberText,
        answerText: answerText,
      });
    });
    if (this.isMobile) {
      container.setPosition(
        this.uiCamera.centerX - container.getBounds().width * 0.5,
        10
      );
      this.staticBubblesLayer.add(container);
    } else {
      container.setPosition(
        entity.quizData.x -
          container.getBounds().width * entity.quizData.origin?.x ?? 0,
        entity.quizData.y +
          VERTICAL_OFFSET -
          container.getBounds().height * entity.quizData.origin?.y ?? 0
      );
      this.bubblesLayer.add(container);
    }
    entity.quizState.gameObjects = {
      container: container,
      questionText: questionText,
      answers: answers,
    };

    entity.quizState.started = true;
    entity.quizState.shown = true;
    if (this.isMobile) {
      this.correctAnswersText.setVisible(false);
    }
    this.updateCameraFollowOffset();
    if (!this.isMobile) {
      this.applyDialogZoom(DIALOG_ZOOM_AMOUNT);
    }
  }

  hideQuiz(entity) {
    if (entity.quizState.gameObjects) {
      if (this.isMobile) {
        this.staticBubblesLayer.remove(entity.quizState.gameObjects.container);
      } else {
        this.bubblesLayer.remove(entity.quizState.gameObjects.container);
      }
      entity.quizState.gameObjects.container.destroy();
      entity.quizState.gameObjects = null;
      this.applyDialogZoom(0);
    }
    entity.quizState.shown = false;
    this.correctAnswersText.setVisible(true);
    this.updateCameraFollowOffset();
  }

  applyDialogZoom(dialogZoom) {
    this.dialogZoom = dialogZoom;
    this.applyCameraZoom(DIALOG_ZOOM_DURATION, DIALOG_ZOOM_EASING);
  }

  applyJumpZoom(jumpZoom, easing) {
    this.jumpZoom = jumpZoom;
    const jumpZoomDuration = this.isMobile
      ? JUMP_ZOOM_DURATION_MOBILE
      : JUMP_ZOOM_DURATION;
    this.applyCameraZoom(jumpZoomDuration, easing);
  }

  applyCameraZoom(duration, easing) {
    const zoom = this.getFullZoom();
    this.mainCamera.zoomEffect.reset();
    this.mainCamera.zoomTo(
      zoom,
      duration,
      easing,
      false,
      (camera, progress) => {
        this.resizeStaticObjects();
        this.updateCameraFollowOffset();
      }
    );
  }

  updateCorrectAnswersText() {
    this.correctAnswersText.text = `[stroke]${this.correctAnswers} ${decl(
      this.correctAnswers,
      ["правильный ответ", "правильных ответа", "правильных ответов"]
    )}[/stroke]`;
  }

  answerQuiz(entity, number) {
    if (entity.quizData.correctNumber === number) {
      entity.quizState.answered = true;
      entity.quizState.solved = true;
      entity.quizState.gameObjects.answers[number - 1].answerBubble.setTexture(
        `answer-${number}-correct`
      );
      entity.quizState.gameObjects.answers[number - 1].answerText.setColor(
        "#FFFFFF"
      );
      entity.quizState.gameObjects.answers[
        number - 1
      ].answerNumberText.setColor("#FFFFFF");
      this.correctAnswers++;
      this.updateCorrectAnswersText();
      if (!this.isMobile) {
        this.correctAnswersText.setVisible(true);
      }
      this.sfxQuizSuccess.play();
    } else {
      entity.quizState.answered = true;
      entity.quizState.gameObjects.answers[number - 1].answerBubble.setTexture(
        `answer-${number}-wrong`
      );
      entity.quizState.gameObjects.answers[number - 1].answerText.setColor(
        "#FFFFFF"
      );
      entity.quizState.gameObjects.answers[
        number - 1
      ].answerNumberText.setColor("#FFFFFF");
      this.sfxQuizFail.play();
    }
    this.advanceQuizDialogueTimeout = setTimeout(() => {
      this.advanceQuizDialogueTimeout = null;
      this.advanceQuizDialogue(entity);
    }, 750);
  }

  advanceQuizDialogue(entity) {
    if (this.advanceQuizDialogueTimeout) {
      clearTimeout(this.advanceQuizDialogueTimeout);
      this.advanceQuizDialogueTimeout = null;
    }
    if (entity.quizState.gameObjects) {
      if (this.isMobile) {
        this.staticBubblesLayer.remove(entity.quizState.gameObjects.container);
      } else {
        this.bubblesLayer.remove(entity.quizState.gameObjects.container);
      }
      entity.quizState.gameObjects.container.destroy();
      entity.quizState.gameObjects = null;
    }
    let lines = entity.quizState.solved
      ? entity.quizData.correctAnswerLines
      : entity.quizData.wrongAnswerLines;
    let currentLine =
      entity.quizState.currentLine == null ? 0 : entity.quizState.currentLine;
    if (lines && lines.length > currentLine) {
      // at first line play a sound
      if (currentLine === 0 && entity.soundData && entity.soundState) {
        if (entity.soundState.skipNext) {
          entity.soundState.skipNext = false;
        } else {
          if (!this.anyEntitySoundIsPlaying()) {
            entity.soundInstance.play();
          }
        }
      }
      const line = lines[currentLine];
      this.showQuizLine(entity, line);
      entity.quizState.currentLine = currentLine + 1;
      this.updateCameraFollowOffset();
      if (!this.isMobile) {
        this.applyDialogZoom(DIALOG_ZOOM_AMOUNT);
      }
      if (this.isMobile) {
        this.correctAnswersText.setVisible(false);
      }
      entity.quizState.shown = true;
    } else {
      entity.quizState.finished = true;
      entity.quizState.shown = false;
      this.correctAnswersText.setVisible(true);
      this.applyDialogZoom(0);
    }
  }

  hideQuizDialogue(entity) {
    if (entity.quizState.gameObjects) {
      if (this.isMobile) {
        this.staticBubblesLayer.remove(entity.quizState.gameObjects.container);
      } else {
        this.bubblesLayer.remove(entity.quizState.gameObjects.container);
      }
      entity.quizState.gameObjects.container.destroy();
      entity.quizState.gameObjects = null;
      this.applyDialogZoom(0);
    }
    entity.quizState.shown = false;
    this.correctAnswersText.setVisible(true);
    this.updateCameraFollowOffset();
  }

  showQuizLine(entity, line) {
    const container = this.add.container(0, 0);
    const lineText = this.add.rexBBCodeText({
      x: 0,
      y: 0,
      text: line,
      style: {
        fontFamily: "Onest",
        fontSize: 16,
        lineSpacing: 6,
        color: "#000",
        // wordWrap: { width: 385, useAdvancedWrap: true },
        wrap: {
          mode: "word",
          width: 385,
        },
      },
    });
    const bubbleSpriteKey = this.getBubbleSize(
      lineText.getBounds().width,
      lineText.getBounds().height
    );
    const lineBubble = this.add.image(0, 0, bubbleSpriteKey).setOrigin(0, 0);
    lineText
      .setPosition(
        lineBubble.getBounds().centerX,
        lineBubble.getBounds().centerY
      )
      .setOrigin(0.5, 0.5);
    container.add(lineBubble);
    container.add(lineText);
    lineBubble.setInteractive();
    lineBubble.on("pointerdown", () => {
      this.touchState.speak = true;
    });
    if (this.isMobile) {
      container.setPosition(
        this.uiCamera.centerX - container.getBounds().width * 0.5,
        10
      );
      this.staticBubblesLayer.add(container);
    } else {
      container.setPosition(
        entity.quizData.x -
          container.getBounds().width * entity.quizData.origin?.x ?? 0,
        entity.quizData.y +
          VERTICAL_OFFSET -
          container.getBounds().height * entity.quizData.origin?.y ?? 0
      );
      this.bubblesLayer.add(container);
    }
    entity.quizState.gameObjects = {
      container: container,
      lineBubble: lineBubble,
      lineText: lineText,
    };
  }

  showPopup(entity) {
    if (entity.popupState.gameObjects) {
      return;
    }
    if (!entity.popupState.interacted) {
      entity.popupState.interacted = true;
      this.interactedObjects++;
      this.interactedObjectsText.text = `Interacted objects: ${this.interactedObjects}`;
    }
    const popupData = entity.popupData;
    const container = this.add.container(0, 0);
    const lineText = this.add.rexBBCodeText({
      x: 0,
      y: 0,
      text: popupData.text,
      style: {
        fontFamily: "Onest",
        fontSize: 16,
        lineSpacing: 10,
        color: "#000",
        // wordWrap: { width: 385, useAdvancedWrap: true },
        wrap: {
          mode: "word",
          width: 838,
        },
      },
    });
    const bubbleSpriteKey = this.getPopupBubbleSize(
      lineText.getBounds().width,
      lineText.getBounds().height
    );
    const lineBubble = this.add.image(0, 0, bubbleSpriteKey).setOrigin(0, 0);
    lineText
      .setPosition(
        lineBubble.getBounds().centerX,
        lineBubble.getBounds().centerY
      )
      .setOrigin(0.5, 0.5);
    container.add(lineBubble);
    container.add(lineText);
    container.setPosition(
      popupData.x - container.getBounds().width * popupData.origin?.x ?? 0,
      popupData.y +
        VERTICAL_OFFSET -
        container.getBounds().height * popupData.origin?.y ?? 0
    );
    this.bubblesLayer.add(container);
    entity.popupState.gameObjects = {
      container: container,
      lineBubble: lineBubble,
      lineText: lineText,
    };
    entity.popupState.shown = true;
  }

  hidePopup(entity) {
    if (entity.popupState.gameObjects) {
      this.bubblesLayer.remove(entity.popupState.gameObjects.container);
      entity.popupState.gameObjects.container.destroy();
      entity.popupState.gameObjects = null;
    }
    entity.popupState.shown = false;
    if (entity.soundState) {
      entity.soundState.played = false;
    }
  }

  advanceDialogue(entity) {
    entity.dialogueState.started = true;
    if (!entity.dialogueState.interacted) {
      entity.dialogueState.interacted = true;
      this.interactedObjects++;
      this.interactedObjectsText.text = `Interacted objects: ${this.interactedObjects}`;
    }
    if (entity.dialogueState.gameObjects) {
      // cleanup previous text bubbles
      this.bubblesLayer.remove(entity.dialogueState.gameObjects.container);
      entity.dialogueState.gameObjects.container.destroy();
      entity.dialogueState.gameObjects = null;
    }
    let lines = entity.dialogueData.lines;
    let currentLine =
      entity.dialogueState.currentLine == null
        ? 0
        : entity.dialogueState.currentLine;
    if (lines && lines.length > currentLine) {
      // at first line play a sound
      if (currentLine === 0 && entity.soundData && entity.soundState) {
        if (entity.soundState.skipNext) {
          entity.soundState.skipNext = false;
        } else {
          if (!this.anyEntitySoundIsPlaying()) {
            entity.soundInstance.play();
          }
        }
      }
      const line = lines[currentLine];
      this.showDialogueLine(entity, line);
      entity.dialogueState.isPlayer = line.player;
      entity.dialogueState.currentLine = currentLine + 1;
      entity.dialogueState.shown = true;
      this.updateCameraFollowOffset();
      if (!this.isMobile) {
        this.applyDialogZoom(DIALOG_ZOOM_AMOUNT);
      }
    } else {
      entity.dialogueState.started = false;
      entity.dialogueState.finished = true;
      entity.dialogueState.shown = false;
      entity.dialogueState.currentLine = null;
      this.applyDialogZoom(0);
    }
  }

  hideDialogue(entity) {
    if (entity.dialogueState.gameObjects) {
      // cleanup previous text bubbles
      this.bubblesLayer.remove(entity.dialogueState.gameObjects.container);
      entity.dialogueState.gameObjects.container.destroy();
      entity.dialogueState.gameObjects = null;
      this.applyDialogZoom(0);
    }
    entity.dialogueState.shown = false;
  }

  showDialogueLine(entity, line) {
    const container = this.add.container(0, 0);
    const lineText = this.add.rexBBCodeText({
      x: 0,
      y: 0,
      text: line.text,
      style: {
        fontFamily: "Onest",
        fontSize: 16,
        lineSpacing: 10,
        color: "#000",
        // wordWrap: { width: 385, useAdvancedWrap: true },
        wrap: {
          mode: "word",
          width: 385,
        },
      },
    });
    const bubbleSpriteKey = this.getBubbleSize(
      lineText.getBounds().width,
      lineText.getBounds().height
    );
    const lineBubble = this.add.image(0, 0, bubbleSpriteKey).setOrigin(0, 0);
    lineText
      .setPosition(
        lineBubble.getBounds().centerX,
        lineBubble.getBounds().centerY
      )
      .setOrigin(0.5, 0.5);
    container.add(lineBubble);
    container.add(lineText);
    if (!line.player) {
      container.setPosition(
        entity.dialogueData.x -
          container.getBounds().width * entity.dialogueData.origin?.x ?? 0,
        entity.dialogueData.y +
          VERTICAL_OFFSET -
          container.getBounds().height * entity.dialogueData.origin?.y ?? 0
      );
    }
    this.bubblesLayer.add(container);
    entity.dialogueState.gameObjects = {
      container: container,
      lineBubble: lineBubble,
      lineText: lineText,
    };
  }

  /**
   * @param {Phaser.Physics.Arcade.Sprite} entity
   */
  showExit(entity) {
    if (!entity.exitState.interacted) {
      entity.exitState.interacted = true;
      this.interactedObjects++;
      this.interactedObjectsText.text = `Interacted objects: ${this.interactedObjects}`;
    }
    const container = this.add.container(0, 0);
    const questionText = this.add
      .rexBBCodeText({
        x: 0,
        y: 0,
        text: entity.exitData.text,
        style: {
          fontFamily: "ComicCat",
          fontSize: 28,
          lineSpacing: 10,
          color: "#000000",
          stroke: "#fff", // null, css string, or number
          strokeThickness: 5,
          wrap: {
            mode: "word",
            width: 644,
          },
        },
      })
      .setOrigin(0, 0);
    container.add(questionText);
    let offsetX = 0;
    let offsetY = questionText.getBounds().bottom + 15;

    const answers = [];
    [entity.exitData.yes, entity.exitData.no].forEach((answer, answerIndex) => {
      const answerBubble = this.add
        .image(offsetX, offsetY, `answer-${answerIndex + 1}`)
        .setOrigin(0, 0);
      const answerNumberText = this.add
        .rexBBCodeText({
          x: offsetX + 15,
          y: offsetY + Math.round(answerBubble.getBounds().height / 2),
          text: answerIndex + 1,
          style: {
            fontFamily: "Onest",
            fontSize: 16,
            lineSpacing: 4,
            color: "#E13914",
          },
        })
        .setOrigin(0, 0.5);
      const answerText = this.add
        .rexBBCodeText({
          x: offsetX + answerNumberText.getBounds().width + 30,
          y: offsetY + Math.round(answerBubble.getBounds().height / 2),
          text: answer,
          style: {
            fontFamily: "Onest",
            fontSize: 16,
            lineSpacing: 4,
            color: "#000000",
          },
        })
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
      answerBubble.setInteractive();
      answerBubble.on("pointerdown", () => {
        this.touchState[`answer${answerIndex + 1}`] = true;
      });
      answers.push({
        answerBubble: answerBubble,
        answerNumberText: answerNumberText,
        answerText: answerText,
      });
    });
    if (this.isMobile) {
      container.setPosition(
        this.uiCamera.centerX - container.getBounds().width * 0.5,
        10
      );
      this.staticBubblesLayer.add(container);
    } else {
      container.setPosition(
        entity.exitData.x -
          container.getBounds().width * entity.exitData.origin?.x ?? 0,
        entity.exitData.y +
          VERTICAL_OFFSET -
          container.getBounds().height * entity.exitData.origin?.y ?? 0
      );
      this.bubblesLayer.add(container);
    }
    entity.exitState.gameObjects = {
      container: container,
      questionText: questionText,
      answers: answers,
    };

    entity.exitState.started = true;
    entity.exitState.shown = true;
    if (this.isMobile) {
      this.correctAnswersText.setVisible(false);
    }
    this.updateCameraFollowOffset();
    if (!this.isMobile) {
      this.applyDialogZoom(DIALOG_ZOOM_AMOUNT);
    }
  }

  hideExit(entity) {
    if (entity.exitState.gameObjects) {
      if (this.isMobile) {
        this.staticBubblesLayer.remove(entity.exitState.gameObjects.container);
      } else {
        this.bubblesLayer.remove(entity.exitState.gameObjects.container);
      }
      entity.exitState.gameObjects.container.destroy();
      entity.exitState.gameObjects = null;
      this.applyDialogZoom(0);
    }
    entity.exitState.shown = false;
    this.correctAnswersText.setVisible(true);
    this.updateCameraFollowOffset();
  }

  answerExit(entity, number) {
    if (number === 1) {
      // exit
    } else {
      // not exit
      this.hideExit(entity);
      entity.exitState.started = false;
    }
  }

  enterPortal(entity) {
    entity.portalState.interacted = true;
    this.saveProgress();
    if (entity.portalData.type === "hydra") {
      window.location.href = "/hydra/";
    } else if (entity.portalData.type === "maestro") {
      window.localStorage.setItem("gameScore", this.correctAnswers);
      window.localStorage.setItem("gameFinishPage", this.getFinishPage());
      window.location.href = "/maestro/";
    }
  }

  getFinishPage() {
    const score = this.correctAnswers;
    if (score <= 13) {
      return "awful";
    } else if (score <= 26) {
      return "bad";
    } else if (score <= 40) {
      return "average";
    } else if (score <= 55) {
      return "good";
    } else {
      return "genius";
    }
  }

  getBubbleSize(textWidth, textHeight) {
    if (textHeight <= 50) {
      if (textWidth <= 383) {
        return "bubble-line-narrow";
      } else if (textWidth <= 558) {
        return "bubble-line";
      } else {
        return "bubble-line-wide";
      }
    } else if (textWidth <= 86) {
      return "bubble-medium";
    } else {
      return "bubble-large";
    }
  }

  getPopupBubbleSize(textWidth, textHeight) {
    if (textHeight <= 50) {
      if (textWidth <= 300) {
        return "bubble-line-tiny";
      } else if (textWidth <= 379) {
        return "bubble-line-narrow";
      } else if (textWidth <= 558) {
        return "bubble-line";
      } else if (textWidth <= 673) {
        return "bubble-line-wide";
      } else {
        return "bubble-line-ultrawide";
      }
    } else if (textWidth <= 86) {
      return "bubble-medium";
    } else {
      return "bubble-large";
    }
  }

  handleInput() {
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
        (this.cursors.up.isDown ||
          this.cursors.space.isDown ||
          this.keyW.isDown ||
          this.touchState.jump) &&
        this.player.body.blocked.down
      ) {
        this.player.setVelocityY(-1200);
      }
    }

    const nearbyEntity = this.nearbyEntityName
      ? this.entities[this.nearbyEntityName]
      : null;

    if (nearbyEntity) {
      if (nearbyEntity.quizData) {
        if (!nearbyEntity.quizState.started) {
          if (
            Phaser.Input.Keyboard.JustDown(this.keyEnter) ||
            this.touchState.speak ||
            this.touchState.enter
          ) {
            this.touchState.speak = false;
            this.touchState.enter = false;
            this.player.setVelocityX(0);
            this.player.play("thinking");
            this.sfxQuizStart.play();
            this.showQuiz(nearbyEntity);
          }
        } else {
          if (!nearbyEntity.quizState.answered) {
            [1, 2, 3, 4].forEach((number) => {
              if (
                Phaser.Input.Keyboard.JustDown(this[`key${number}`]) ||
                this.touchState[`answer${number}`]
              ) {
                this.touchState[`answer${number}`] = false;
                this.answerQuiz(nearbyEntity, number);
              }
            });
          } else {
            if (
              Phaser.Input.Keyboard.JustDown(this.keyEnter) ||
              this.touchState.speak ||
              this.touchState.enter
            ) {
              this.touchState.speak = false;
              this.touchState.enter = false;
              if (nearbyEntity.quizState.finished) {
                nearbyEntity.quizState.finished = false;
                nearbyEntity.quizState.currentLine = null;
              }
              this.advanceQuizDialogue(nearbyEntity);
            }
          }
        }
      } else if (nearbyEntity.dialogueData) {
        if (
          Phaser.Input.Keyboard.JustDown(this.keyEnter) ||
          this.touchState.speak ||
          this.touchState.enter
        ) {
          this.touchState.speak = false;
          this.touchState.enter = false;
          this.player.setVelocityX(0);
          this.player.play("thinking");
          this.advanceDialogue(nearbyEntity);
        }
      } else if (nearbyEntity.portalData) {
        if (!nearbyEntity.portalState.interacted) {
          if (
            Phaser.Input.Keyboard.JustDown(this.keyEnter) ||
            this.touchState.speak ||
            this.touchState.enter
          ) {
            this.enterPortal(nearbyEntity);
          }
        }
      } else if (nearbyEntity.exitData) {
        if (!nearbyEntity.exitState.shown) {
          if (
            Phaser.Input.Keyboard.JustDown(this.keyEnter) ||
            this.touchState.speak ||
            this.touchState.enter
          ) {
            this.touchState.speak = false;
            this.touchState.enter = false;
            this.player.setVelocityX(0);
            this.player.play("thinking");
            this.showExit(nearbyEntity);
          }
        } else {
          [1, 2].forEach((number) => {
            if (
              Phaser.Input.Keyboard.JustDown(this[`key${number}`]) ||
              this.touchState[`answer${number}`]
            ) {
              this.touchState[`answer${number}`] = false;
              this.answerExit(nearbyEntity, number);
            }
          });
        }
      }
    }

    if (
      Phaser.Input.Keyboard.JustDown(this.keyPlus) ||
      (this.keyPlus.isDown &&
        !Phaser.Input.Keyboard.DownDuration(this.keyPlus, 500))
    ) {
      this.mainCamera.zoom += 0.1;
      this.shouldResizeStaticObjects = true;
    } else if (
      Phaser.Input.Keyboard.JustDown(this.keyMinus) ||
      (this.keyMinus.isDown &&
        !Phaser.Input.Keyboard.DownDuration(this.keyMinus, 500))
    ) {
      this.mainCamera.zoom -= 0.1;
      this.shouldResizeStaticObjects = true;
    }

    // if (Phaser.Input.Keyboard.JustDown(this.keyF)) {
    //   if (this.physics.world.drawDebug) {
    //     this.physics.world.drawDebug = false;
    //     this.physics.world.debugGraphic.clear();
    //   } else {
    //     this.physics.world.drawDebug = true;
    //   }
    // }

    // if (Phaser.Input.Keyboard.JustDown(this.keyP)) {
    //   if (this.pointerDebugText.visible) {
    //     this.pointerDebugText.setVisible(false);
    //     this.pointerDebugX.setVisible(false);
    //     this.pointerDebugY.setVisible(false);
    //   } else {
    //     this.pointerDebugText.setVisible(true);
    //     this.pointerDebugX.setVisible(true);
    //     this.pointerDebugY.setVisible(true);
    //   }
    // }
  }

  update() {
    const animKey = this.player.anims.currentAnim.key;
    if (this.player.body.velocity.y < 0) {
      if (this.sfxRun.isPlaying) {
        this.sfxRun.pause();
      }
      if (animKey !== "jump") {
        this.player.play("jump", true);
      }
    } else if (this.player.body.velocity.y > 100) {
      if (this.sfxRun.isPlaying) {
        this.sfxRun.pause();
      }
      if (animKey !== "fall") {
        this.player.play("fall", true);
      }
    } else if (this.player.body.blocked.down) {
      if (["fall", "jump"].includes(animKey)) {
        if (!this.sfxLand.isPlaying) {
          this.sfxLand.play();
        }
      }
      if (Math.abs(this.player.body.velocity.x) > 0) {
        if (!this.sfxRun.isPlaying) {
          this.sfxRun.play(null, { loop: true });
        }
        if (animKey !== "run") {
          this.player.play("run", true);
        }
      } else {
        if (["jump", "fall", "run"].includes(animKey)) {
          this.sfxRun.pause();
          this.player.play("still", true);
        }
      }
    }

    const jumpZoomAmount = this.isMobile
      ? JUMP_ZOOM_AMOUNT_MOBILE
      : JUMP_ZOOM_AMOUNT;
    if (this.player.body.velocity.y < 0 && this.jumpZoom !== jumpZoomAmount) {
      this.applyJumpZoom(jumpZoomAmount, JUMP_ZOOM_UP_EASING);
    } else if (
      Math.abs(this.player.body.velocity.y) < 0.01 &&
      this.jumpZoom !== 0
    ) {
      this.applyJumpZoom(0, JUMP_ZOOM_DOWN_EASING);
    }

    let nearbyEntityName = null;
    Object.entries(this.entities).forEach(([entityName, entity]) => {
      const anyArea =
        entity.quizArea ||
        entity.popupArea ||
        entity.dialogueArea ||
        entity.exitArea ||
        entity.portalArea;
      if (anyArea && this.physics.world.overlap(this.player, anyArea)) {
        nearbyEntityName = entityName;
      }

      if (entity.popupArea) {
        if (
          this.physics.world.overlap(this.player, entity.popupArea) &&
          !entity.popupState.shown
        ) {
          this.showPopup(entity);
        } else if (
          !this.physics.world.overlap(this.player, entity.popupArea) &&
          entity.popupState.shown
        ) {
          this.hidePopup(entity);
        }
      }

      if (entity.quizArea && entity.quizState) {
        if (
          entity.quizState.shown &&
          !this.physics.world.overlap(this.player, entity.quizArea)
        ) {
          // out of range of active quiz area
          if (!entity.quizState.answered) {
            this.hideQuiz(entity);
          } else {
            this.hideQuizDialogue(entity);
          }
        } else if (
          entity.quizState.started &&
          !entity.quizState.finished &&
          !entity.quizState.shown &&
          this.physics.world.overlap(this.player, entity.quizArea)
        ) {
          // in range if active quiz
          if (!entity.quizState.answered) {
            this.showQuiz(entity);
          } else {
            if (entity.quizState.currentLine > 0) {
              entity.quizState.currentLine--;
            }
            this.advanceQuizDialogue(entity);
          }
        }
      }

      if (entity.dialogueArea && entity.dialogueState) {
        if (
          entity.dialogueState.shown &&
          !this.physics.world.overlap(this.player, entity.dialogueArea)
        ) {
          this.hideDialogue(entity);
        } else if (
          entity.dialogueState.started &&
          !entity.dialogueState.shown &&
          this.physics.world.overlap(this.player, entity.dialogueArea)
        ) {
          if (entity.dialogueState.currentLine > 0) {
            entity.dialogueState.currentLine--;
          }
          this.advanceDialogue(entity);
        }

        if (entity.dialogueState.shown && entity.dialogueState.isPlayer) {
          const container = entity.dialogueState.gameObjects.container;
          container.setPosition(
            this.player.getBounds().centerX -
              Math.round(container.getBounds().width / 2),
            this.player.getBounds().y - container.getBounds().height - 15
          );
        }
      }

      if (entity.exitArea && entity.exitState) {
        if (
          entity.exitState.shown &&
          !this.physics.world.overlap(this.player, entity.exitArea)
        ) {
          // out of range of active exit area
          this.hideExit(entity);
        } else if (
          entity.exitState.started &&
          !entity.exitState.shown &&
          this.physics.world.overlap(this.player, entity.exitArea)
        ) {
          // in range if active exit
          this.showExit(entity);
        }
      }

      if (entity.portalArea && entity.portalState && entity.anims.currentAnim) {
        const curAnim = entity.anims.currentAnim.key;
        const animEnter = `${entity.portalData.sprite}_enter`;
        const animLeave = `${entity.portalData.sprite}_leave`;
        const overlaps = this.physics.world.overlap(
          this.player,
          entity.portalArea
        );
        if (
          overlaps &&
          !entity.portalState.interacted &&
          curAnim !== animEnter
        ) {
          if (!entity.anims.isPlaying) {
            entity.play(animEnter);
          } else {
            entity.once("animationcomplete", () => {
              entity.play(animEnter);
            });
          }
        } else if (!overlaps && curAnim === animEnter) {
          if (!entity.anims.isPlaying) {
            entity.play(animLeave);
          } else {
            entity.once("animationcomplete", () => {
              entity.play(animLeave);
            });
          }
        }
      }

      if (
        entity.soundData &&
        entity.soundState &&
        !entity.soundState.played &&
        anyArea &&
        this.physics.world.overlap(this.player, anyArea)
      ) {
        if (!this.anyEntitySoundIsPlaying()) {
          entity.soundInstance.play();
          entity.soundState.played = true;
        }
      }
    });

    let nearbyEntity = nearbyEntityName
      ? this.entities[nearbyEntityName]
      : null;

    if (this.nearbyEntityName !== nearbyEntityName) {
      this.nearbyEntityName = nearbyEntityName;
    }

    const showQuest = Boolean(
      nearbyEntity &&
        ((nearbyEntity.quizState && !nearbyEntity.quizState.started) ||
          (nearbyEntity.dialogueState &&
            !nearbyEntity.dialogueState.started &&
            !nearbyEntity.dialogueState.finished) ||
          (nearbyEntity.exitState && !nearbyEntity.exitState.shown) ||
          (nearbyEntity.portalState && !nearbyEntity.portalState.interacted))
    );
    if (showQuest) {
      this.quest.setPosition(
        this.player.getBounds().centerX,
        this.player.getBounds().top - 20
      );
    }
    if (this.quest.visible !== showQuest) {
      this.quest.setVisible(showQuest);
    }

    const showSpeak = Boolean(
      nearbyEntity &&
        ((nearbyEntity.quizState &&
          (!nearbyEntity.quizState.started ||
            nearbyEntity.quizState.answered)) ||
          nearbyEntity.dialogueState ||
          (nearbyEntity.exitState && !nearbyEntity.exitState.shown) ||
          (nearbyEntity.portalState && !nearbyEntity.portalState.interacted))
    );
    if (this.isMobile && this.controls.speak.visible !== showSpeak) {
      this.controls.speak.setVisible(showSpeak);
      if (this.controls.enter.visible) {
        this.controls.enter.setVisible(false);
      }
    } else if (!this.isMobile && this.controls.enter.visible !== showSpeak) {
      this.controls.enter.setVisible(showSpeak);
      if (this.controls.speak.visible) {
        this.controls.speak.setVisible(false);
      }
    }

    this.bg.clouds.setTilePosition(
      this.mainCamera.scrollX * 0.6 -
        500 / this.mainCamera.zoom -
        this.cloudsPosition,
      0
    );
    this.bg.bg1.setTilePosition(
      this.mainCamera.scrollX * 0.5 - 500 / this.mainCamera.zoom,
      0
    );
    this.bg.bg2.setTilePosition(
      this.mainCamera.scrollX * 0.25 - 500 / this.mainCamera.zoom,
      0
    );
    this.bg.bg3.setTilePosition(
      this.mainCamera.scrollX * 0.125 - 500 / this.mainCamera.zoom,
      0
    );

    this.cloudsPosition -= 0.5;

    if (this.mainCamera.worldView.width > 0 && this.shouldResizeStaticObjects) {
      this.resizeStaticObjects();
      this.shouldResizeStaticObjects = false;
    }

    // const pointerX = this.input.mousePointer.positionToCamera(
    //   this.mainCamera
    // ).x;
    // const pointerY = this.input.mousePointer.positionToCamera(
    //   this.mainCamera
    // ).y;
    // this.pointerDebugText.setText([
    //   `X: ${pointerX.toFixed(2)}`,
    //   `Y: ${(pointerY - VERTICAL_OFFSET).toFixed(2)}`,
    // ]);
    // this.pointerDebugText.setPosition(pointerX + 20, pointerY + 20);
    // this.pointerDebugX.setTo(pointerX, 0, pointerX, WORLD_HEIGHT);
    // this.pointerDebugY.setTo(0, pointerY, WORLD_WIDTH, pointerY);

    this.checkNyanCatMode();

    this.updateCurrentYear();

    this.handleInput();
  }

  updateCurrentYear() {
    let sprite = this.years[0].sprite;
    for (let i = 0 ; i < this.years.length; i++) {
      if (this.player.x >= this.years[i].x) {
        sprite = this.years[i].sprite;
      } else {
        break;
      }
    }
    if (this.currentYear.texture.key !== sprite) {
      this.currentYear.setTexture(sprite);
    }
  }

  resizeStaticObjects() {
    const camZoom = this.mainCamera.zoom;
    const camWidth = this.mainCamera.worldView.width;
    const camHeight = this.mainCamera.worldView.height;
    const unscaledWidth = camWidth * camZoom;
    const unscaledHeight = camHeight * camZoom;
    const topX = (unscaledWidth - camWidth) / 2;
    const topY = (unscaledHeight - camHeight) / 2;

    this.bg.clouds.width = Math.ceil(camWidth);
    this.bg.clouds.x = Math.round(topX);
    this.bg.bg1.width = Math.ceil(camWidth);
    this.bg.bg1.x = Math.round(topX);
    this.bg.bg2.width = Math.ceil(camWidth);
    this.bg.bg2.x = Math.round(topX);
    this.bg.bg3.width = Math.ceil(camWidth);
    this.bg.bg3.x = Math.round(topX);

    this.currentYear.setPosition(
      Math.round(topX + camWidth / 2),
      WORLD_HEIGHT - 20
    );

    // this.correctAnswersText.setPosition(topX + 15, topY + 15);

    const uiCamWidth = this.uiCamera.worldView.width;
    const uiCamHeight = this.uiCamera.worldView.height;

    this.controls.layer.each((item) => {
      item.setScale(0.5);
    });
    this.controls.left.setPosition(this.safeAreaLeft + 32, uiCamHeight - 32);
    this.controls.right.setPosition(
      this.safeAreaLeft + 32 + this.controls.left.displayWidth + 32,
      uiCamHeight - 32
    );
    this.controls.jump.setPosition(
      uiCamWidth - this.safeAreaRight - 32,
      uiCamHeight - 32
    );
    this.controls.enter.setPosition(
      uiCamWidth - this.safeAreaRight - 32,
      uiCamHeight - 32 - this.controls.jump.displayHeight - 32
    );
    if (this.isMobile) {
      this.controls.soundOn.setPosition(
        uiCamWidth - this.safeAreaRight - 28,
        8
      );
      this.controls.soundOff.setPosition(
        uiCamWidth - this.safeAreaRight - 28,
        8
      );
    } else {
      this.controls.soundOn.setPosition(
        uiCamWidth - this.safeAreaRight - 28,
        16
      );
      this.controls.soundOff.setPosition(
        uiCamWidth - this.safeAreaRight - 28,
        16
      );
    }
    this.controls.speak.setPosition(
      uiCamWidth - this.safeAreaRight - 32,
      Math.round(uiCamHeight / 2) - 15
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
    const speak = this.add.image(0, 0, "control-speak").setOrigin(1, 0.5);
    const enter = this.add.image(0, 0, "control-enter").setOrigin(1, 1);
    const soundOn = this.add.image(0, 0, "sound-on").setOrigin(1, 0);
    const soundOff = this.add.image(0, 0, "sound-off").setOrigin(1, 0);
    speak.setVisible(false);
    enter.setVisible(false);
    soundOff.setVisible(false);
    controlsLayer.add([left, right, jump, speak, enter, soundOn, soundOff]);
    controlsLayer.each((item) => {
      item.setScrollFactor(0, 0);
      item.setInteractive();
    });
    const buttons = { left, right, jump, speak, enter };
    const pointers = {};
    Object.entries(buttons).forEach(([keyName, key]) => {
      key.on("pointerdown", (pointer) => {
        key.setAlpha(0.5);
        this.touchState[keyName] = true;
        pointers[pointer.id] = keyName;
      });
      // key.on("pointerup", (pointer) => {

      // });
    });
    this.input.on("pointerup", (pointer, currentlyOver) => {
      const keyName = pointers[pointer.id];
      if (keyName) {
        const key = buttons[keyName];
        key.setAlpha(1);
        this.touchState[keyName] = false;
        delete pointers[pointer.id];
      }
    });
    soundOn.on("pointerdown", () => {
      soundOn.setVisible(false);
      soundOff.setVisible(true);
      this.sound.setMute(true);
    });
    soundOff.on("pointerdown", () => {
      soundOff.setVisible(false);
      soundOn.setVisible(true);
      this.sound.setMute(false);
    });
    this.controls = {
      layer: controlsLayer,
      left,
      right,
      jump,
      speak,
      enter,
      soundOn,
      soundOff,
    };
  }

  panToFitBubbles() {
    const nearbyEntity = this.nearbyEntityName
      ? this.entities[this.nearbyEntityName]
      : null;
    const padding = 15;
    let camOffset = { x: 0, y: 0 };
    if (nearbyEntity) {
      if (nearbyEntity.quizState.shown) {
        const bubbleRect =
          nearbyEntity.quizState.gameObjects.container.getBounds();
        const cameraRect = this.mainCamera.worldView;
        if (bubbleRect.left < cameraRect.left + padding) {
          camOffset.x = cameraRect.left - bubbleRect.left - padding;
        }
        if (bubbleRect.top < cameraRect.top + padding) {
          camOffset.y = cameraRect.top - bubbleRect.top - padding;
        }
      }
    }
    this.mainCamera.setFollowOffset(camOffset.x, camOffset.y);
  }

  saveProgress() {
    const player = {
      x: this.player.x,
      y: this.player.y,
    };
    const entities = {};
    Object.entries(this.entities).forEach(([key, entity]) => {
      const entityState = {};
      const props = [
        "quizState",
        "popupState",
        "dialogueState",
        "soundState",
        "exitState",
        "portalState",
      ];
      props.forEach((prop) => {
        if (entity[prop]) {
          const state = { ...entity[prop] };
          if (state.gameObjects != null) {
            state.gameObjects = null;
          }
          if (state.shown != null) {
            state.shown = false;
          }
          entityState[prop] = state;
        }
      });
      entities[key] = entityState;
    });
    const gameData = JSON.stringify({
      player,
      entities,
      interactedObjects: this.interactedObjects,
      correctAnswers: this.correctAnswers,
    });
    window.localStorage.setItem("gameData", gameData);
  }

  loadProgress() {
    const gameDataJSON = window.localStorage.getItem("gameData");
    if (!gameDataJSON) {
      return;
    }
    const gameData = JSON.parse(gameDataJSON);
    if (!gameData) {
      return;
    }
    this.player.x = gameData.player.x;
    this.player.y = gameData.player.y;
    Object.entries(gameData.entities).forEach(([key, entityData]) => {
      const props = [
        "quizState",
        "popupState",
        "dialogueState",
        "soundState",
        "exitState",
        "portalState",
      ];
      props.forEach((prop) => {
        if (entityData[prop]) {
          this.entities[key][prop] = { ...entityData[prop] };
        }
      });
    });
    this.interactedObjects = gameData.interactedObjects;
    this.correctAnswers = gameData.correctAnswers;
    this.updateCorrectAnswersText();
    if (this.correctAnswers > 0) {
      this.correctAnswersText.setVisible(true);
    }
  }

  anyEntitySoundIsPlaying() {
    let playing = false;
    Object.values(this.entitiesSounds).forEach((entitySound) => {
      if (entitySound.isPlaying) {
        playing = true;
      }
    });
    return playing;
  }

  checkNyanCatMode() {
    const inZone = this.physics.world.overlap(
      this.player,
      this.entities.cat.nyancatArea
    );
    if (inZone && !this.nyancatMode) {
      this.activateNyanCatMode();
    } else if (!inZone && this.nyancatMode) {
      this.deactivateNyanCatMode();
    }
  }

  activateNyanCatMode() {
    this.nyancatMode = true;
    this.bgm.pause();
    this.nyancatBgm.play();
    document.querySelector(".nyancat-overlay").classList.add("active");
  }

  deactivateNyanCatMode() {
    this.nyancatMode = false;
    this.nyancatBgm.pause();
    this.bgm.resume();
    document.querySelector(".nyancat-overlay").classList.remove("active");
  }
}
