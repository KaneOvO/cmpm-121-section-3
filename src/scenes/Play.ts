import * as Phaser from "phaser";

import starfieldUrl from "/assets/starfield.png";

export default class Play extends Phaser.Scene {
  fire?: Phaser.Input.Keyboard.Key;
  left?: Phaser.Input.Keyboard.Key;
  right?: Phaser.Input.Keyboard.Key;

  starfield?: Phaser.GameObjects.TileSprite;
  spinner?: Phaser.GameObjects.Shape;

  rotationSpeed = Phaser.Math.PI2 / 1000; // radians per millisecond
  constructor() {
    super("play");
  }

  preload() {
    this.load.image("starfield", starfieldUrl);
    this.load.image("ship", `ship.png`);
  }

  #addKey(
    name: keyof typeof Phaser.Input.Keyboard.KeyCodes,
  ): Phaser.Input.Keyboard.Key {
    return this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes[name]);
  }

  create() {
    this.fire = this.#addKey("F");
    this.left = this.#addKey("LEFT");
    this.right = this.#addKey("RIGHT");

    const originalX = 0;
    const originalY = 0;

    const w = Number(this.game.config.width);
    const h = Number(this.game.config.height);

    this.starfield = this.add
      .tileSprite(
        originalX,
        originalY,
        this.game.config.width as number,
        this.game.config.height as number,
        "starfield",
      )
      .setOrigin(originalX, originalY);

    const offsetW = 0.1;
    const offsetH = 0.9;
    const sizeX = 50;
    const sizeY = 50;
    const color = 0xff0000;

    this.spinner = this.add.rectangle(
      w * offsetW,
      h * offsetH,
      sizeX,
      sizeY,
      color,
    );

    const enemy1OffsetX = 0.1;
    const enemy1OffsetY = 0.5;

    const enemy1 = new Enemy1(
      this,
      w * enemy1OffsetX,
      h * enemy1OffsetY,
      "ship",
    );

    const sacleEnemy = 1;

    enemy1.setScale(sacleEnemy);
  }

  update() {
    this.starfield!.tilePositionX -= 4;

    const speed = 5;

    if (this.left!.isDown) {
      this.spinner!.x -= speed;
    }
    if (this.right!.isDown) {
      this.spinner!.x += speed;
    }

    const durationTime = 500;

    const offsetH = 0.9;

    if (this.fire!.isDown) {
      const originalY = this.spinner!.y;
      console.log(this.spinner!.y);
      this.tweens.add({
        targets: this.spinner,
        y: originalY - Number(this.game.config.height) - this.spinner!.height,
        duration: durationTime,
        ease: `linear`,
      });
      this.time.delayedCall(700, () => {
        this.spinner!.y = Number(this.game.config.height) * offsetH;
      });
    }
  }
}

class EnemyBase extends Phaser.GameObjects.Sprite {
  private hp: number;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture: string,
    hp: number,
  ) {
    super(scene, x, y, texture);
    this.hp = hp;
    scene.add.existing(this);
  }

  takeDamage(amount: number) {
    this.hp -= amount;

    if (this.hp <= 0) {
      this.destroy();
    }
  }
}

class Enemy1 extends EnemyBase {
  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture: string,
    hp: number = 1,
  ) {
    super(scene, x, y, texture, hp);
  }
}
