import { Engine } from '../core/Engine';
import { IImageTiles } from '../data/SceneData';
import { SpriteData } from '../graphics/ISpriteData';
import { SpriteController } from '../graphics/SpriteController';
import { Texture } from '../graphics/Texture';
import { Component } from './Component';

/**
 * This is a simple background image that scrolls behind the level
 */
export class TileBgComponent extends Component {
  texture: Texture;
  sprite: SpriteController;

  constructor(eng: Engine, id: string) {
    super(eng, id);
    this.sprite = new SpriteController(this.eng);
  }

  async initialize(
    texture: Texture,
    spriteData: SpriteData,
    options: IImageTiles
  ): Promise<void> {
    this.texture = texture;

    this.sprite.initialize(this.texture, spriteData);
    this.sprite.spriteImage(options.image);
    const scaleX = options.size.x / this.sprite.width;
    const scaleY = options.size.y / this.sprite.height;

    this.sprite.depth = 0.8;
    this.sprite.leftOffset = 1;
    this.sprite.topOffset = -1;
    this.sprite.left = options.pos.x;
    this.sprite.top = options.pos.y;
    this.sprite.xScale = scaleX;
    this.sprite.yScale = scaleY;
  }

  update(dt: number) {
    this.sprite.update(dt);
  }

  dispose(): void {
    if (this.texture) {
      this.texture.dispose();
    }
    if (this.sprite) {
      this.sprite.dispose();
    }
  }
}
