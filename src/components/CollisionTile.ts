import { ISprite } from '../graphics/ISprite';
import { Collision2D } from '../physics/Collision2D';
import { Component } from './Component';
import { SpriteController } from '../graphics/SpriteController';
import { IComponentData } from '../data/SceneData';

export interface CollisionTileArgs extends IComponentData {
  bounds: number[];
}

export class CollisionTile extends Component {
  private _sprite: ISprite;
  private _collision: Collision2D;
  private _data: CollisionTileArgs;

  initialize(data: CollisionTileArgs): CollisionTile {
    console.debug('  initializing CollisionTile with ', data);
    this._data = data;
    this._sprite = new SpriteController(this.eng, data.id);
    return this;
  }

  onSceneLoaded(): void {
    console.debug('  onSceneLoaded CollisionTile...');
    //this.eng.scene.getComponent(data.);
  }
}
