import { Engine } from '../core/Engine';
import { IImageTiles } from '../data/SceneData';
import { ISprite } from '../graphics/ISprite';
import { Component } from './Component';

/**
 * This is a simple tile image that is placed on the screen
 */
export class TileImageComponent extends Component {
  private sprite: ISprite;

  constructor(eng: Engine, id: string) {
    super(eng, id);
  }

  async initialize(sprite: ISprite, options: IImageTiles): Promise<void> {
    this.sprite = sprite;
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

  update(dt: number) {}

  draw(dt: number): void {}

  postDraw(dt: number): void {}

  dispose(): void {
    this.sprite.visible = false;
  }
}
