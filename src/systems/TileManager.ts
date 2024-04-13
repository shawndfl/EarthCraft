import { TileImageComponent } from '../components/TileImageComponet';
import { Engine } from '../core/Engine';
import { IImageTiles } from '../data/SceneData';
import { SpriteData } from '../graphics/ISpriteData';
import { SpriteInstanceCollection } from '../graphics/SpriteInstanceCollection';
import { SpriteInstanceController } from '../graphics/SpriteInstanceController';
import { Texture } from '../graphics/Texture';
import { ResourceLoader } from '../utilities/ResourceLoader';
import { SystemComponent } from './SystemComponent';

/**
 * Manages different backgrounds and foregrounds in a level
 */
export class TileManager extends SystemComponent {
  private tiles: TileImageComponent[] = [];

  protected spriteCollections: SpriteInstanceCollection;
  protected tileTexture: Texture;
  protected spriteData: SpriteData;

  constructor(eng: Engine) {
    super(eng);
    this.tileTexture = new Texture('tileTexture', eng.gl);
    this.spriteCollections = new SpriteInstanceCollection(eng);
  }

  async loadTexture(tileSheetUrl: string): Promise<void> {
    // get the tile texture
    await this.tileTexture.loadImage(tileSheetUrl + '.png');
    const spriteDataString = await ResourceLoader.loadFile(
      tileSheetUrl + '.json'
    );
    if (!spriteDataString) {
      console.error('cannot find ' + tileSheetUrl + '.json');
      return;
    }

    const iSpriteData = JSON.parse(spriteDataString);
    this.spriteData = new SpriteData(iSpriteData);

    // manage instances sprites
    this.spriteCollections.initialize(this.tileTexture, this.spriteData);
  }

  createTile(tile: IImageTiles): void {
    // create the background
    const id = tile.id ?? this.eng.random.getUuid();
    const tileComponent = new TileImageComponent(this.eng, id);
    const sprite = new SpriteInstanceController(id, this.spriteCollections);

    tileComponent.initialize(sprite, tile);
  }

  update(dt: number) {
    this.tiles.forEach((t) => t.update(dt));
    this.spriteCollections.update(dt);
  }

  reset(): void {
    this.tiles.forEach((t) => t.dispose());
    this.tiles = [];
  }

  dispose(): void {
    this.tiles.forEach((bg) => bg.dispose());
    this.tiles = [];
  }
}
