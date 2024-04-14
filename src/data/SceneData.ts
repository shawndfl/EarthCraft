import rect from '../math/rect';
import vec2 from '../math/vec2';
import { ResourceLoader } from '../utilities/ResourceLoader';

/**
 * All options the describe the player state
 */
export interface IPlayerOptions {
  pos: vec2;
  meta: Map<string, string>;
}

/**
 * Image tiles
 */
export interface IImageTiles {
  id: string;
  type: string;
  /** image id into the tiles sheet */
  image: string;
  images: string[];
  meta: Map<string, string>;
  pos: vec2;
  size: vec2;
  zIndex: number;
  repeat: boolean;
}

/**
 * Entities can be dynamic objects like enemies and items, and moving platforms
 */
export interface IEntity {
  id: string;
  type: string;
  pos: Readonly<vec2>;
  meta: Map<string, string>;
}

/**
 * Static collision objects
 */
export interface ICollision {
  id: string;
  box: rect;
  type: string;
  meta: Map<string, string>;
}

export const DefaultLevelWidth = 1920 * 8;
export const DefaultLevelHeight = 1020;

/**
 * This is the scene data that will be used by the scene.
 * This data can include 2d platform objects and 3d isometric objects
 */
export class SceneData {
  size: vec2;
  tileSheetUrl: string;
  player: IPlayerOptions;
  entities: IEntity[];
  collision: ICollision[];
  imageTiles: IImageTiles[];

  /**
   * Deserialize the json object
   * @param data
   */
  private constructor(data: ISceneData) {
    this.entities = [];
    this.collision = [];
    this.imageTiles = [];

    this.size = new vec2(data.size);
    this.tileSheetUrl = data.tileSheetUrl;
    this.player = {
      meta: new Map<string, string>(data.player.meta),
      pos: new vec2(data.player.pos),
    };

    data.entities.forEach((e) => {
      const pos = new vec2(e.pos);
      const meta = new Map<string, string>(e.meta);
      this.entities.push({ id: e.id, pos, meta, type: e.type });
    });

    data.images?.forEach((e) => {
      const meta = new Map<string, string>(e.meta);
      const pos = new vec2(e.pos);
      const size = new vec2(e.size);
      this.imageTiles.push({
        id: e.id,
        meta,
        type: e.type,
        images: e.images,
        zIndex: e.zIndex,
        pos,
        size,
        image: e.image,
        repeat: e.repeat,
      });
    });

    data.collision.forEach((e) => {
      const meta = new Map<string, string>(e.meta);
      this.collision.push({
        id: e.id,
        box: new rect(e.box),
        meta,
        type: e.type,
      });
    });
  }

  /**
   * Reset the scene
   */
  reset(): void {
    this.size = new vec2(DefaultLevelWidth, DefaultLevelHeight);
    this.player = {
      pos: new vec2(10, 100),
      meta: new Map<string, string>(),
    };
    this.entities = [];
    this.collision = [];
    this.imageTiles = [];
  }

  /**
   * Saves the scene to local storage
   * @param url
   */
  saveLocally(url: string): void {
    window.localStorage.setItem(url, this.serialize());
  }

  /**
   * This is used to load the scene data. It will look in local storage first then try a remote call
   * @param url
   * @returns
   */
  static async loadFrom(url: string): Promise<SceneData> {
    const result = new Promise<SceneData>((resolve) => {
      let data: ISceneData;
      // check local storage first
      const localStorage = window.localStorage.getItem(url);
      if (localStorage) {
        console.debug('loading scene from local storage');
        data = JSON.parse(localStorage);
        const sceneData = new SceneData(data);

        resolve(sceneData);
      } else {
        // try a remote call
        console.debug('remote loading...');
        ResourceLoader.loadFile(url).then((v) => {
          data = JSON.parse(v);
          console.debug('got scene response', data);
          const sceneData = new SceneData(data);
          resolve(sceneData);
        });
      }
    });
    return result;
  }

  /**
   * Serialize the scene data
   * @returns
   */
  serialize(): string {
    const str = JSON.stringify(this, (_, value) => {
      if (value instanceof vec2) {
        return [value.x, value.y];
      } else if (value instanceof rect) {
        return [value.left, value.width, value.top, value.height];
      } else if (value instanceof Map) {
        return Array.from(value.entries());
      } else {
        return value;
      }
    });
    return str;
  }
}

/**
 * This is the raw level data from json. This will be transform when deserialized
 * by the SceneData class. The SceneData class is the interface the user should use.
 * This interface is just transitional.
 */
interface ISceneData {
  /** the url to the tile sheet without the extension.
   * The level expects to find a .png and .json file with
   * this name in it.
   */
  tileSheetUrl: string;
  /**
   * Size of the level in pixels
   */
  size: [number, number];
  player: {
    pos: [number, number];
    meta: [[string, string]];
  };
  images: {
    id: string;
    type: string;
    pos: [number, number];
    size: [number, number];
    zIndex: number;
    image: string;
    images: [string];
    meta: [[string, string]];
    repeat: boolean;
  }[];
  entities: {
    id: string;
    type: string;
    pos: [number, number];
    meta: [[string, string]];
  }[];
  collision: {
    id: string;
    type: string;
    box: [number, number, number, number];
    meta: [[string, string]];
  }[];
}
