import { IImageTiles } from '../data/ILevelData';
import { Engine } from '../core/Engine';
import { ISprite } from '../graphics/ISprite';
import { Component } from './Component';

/**
 * This is a simple background image that scrolls behind the level
 */
export class TileImageComponent extends Component {
  private sprite: ISprite;

  public get id(): string {
    return this._id;
  }

  constructor(eng: Engine, private _id: string) {
    super(eng);
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

  dispose(): void {
    this.sprite.visible = false;
  }
}
