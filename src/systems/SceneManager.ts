import { SceneComponent } from '../components/SceneComponent';
import { ISceneFactory } from '../interfaces/ISceneFactory';
import { Engine } from '../core/Engine';
import { LevelData } from '../data/ILevelData';
import { SystemComponent } from './SystemComponent';

/**
 * Manages scene loading and switching.
 */
export class SceneManager extends SystemComponent {
  private _activeScene: SceneComponent;
  private _nextSceneType: string;
  private _sceneType: string;
  private _sceneReady: boolean;

  /**
   * Called when a scene is loaded
   */
  OnSceneLoaded: (scene: SceneComponent) => Promise<void>;

  get sceneReady(): boolean {
    return this._sceneReady;
  }

  get scene(): SceneComponent {
    return this._activeScene;
  }

  get sceneType(): string {
    return this._sceneType;
  }

  get sceneData(): LevelData {
    return this._activeScene?.sceneData;
  }

  constructor(eng: Engine, private _sceneFactory: ISceneFactory) {
    super(eng);
  }

  async initialize(): Promise<void> {
    //NOP
  }

  /**
   * resets the scene by  disposing it and reinitializing it.
   */
  reset(): void {
    this.setNextScene(this._sceneType);
  }

  /**
   * Gets the name of a storage level.
   * This is the sceneType with a '*' after it.
   * @returns
   */
  getStorageLevelName(): string {
    return this._sceneType + '*';
  }

  /**
   * Load the storage level. This is a level that is
   * stored in local storage not embedded in the release.
   */
  loadStorageLevel(): void {
    this._nextSceneType = this.getStorageLevelName();
  }

  /**
   * This is used to change the scene on the next update.
   * @param sceneType
   * @param switchNow - should the scene be switched now or wait until the next update.
   */
  setNextScene(type: string): void {
    this._nextSceneType = type;
  }

  /**
   * Switch to a different scene. This should only be called from platform engine.
   * everything else should use setNextScene()
   * @param newScene
   */
  async changeScene(type: string): Promise<boolean> {
    this._sceneType = type;
    this._sceneReady = false;
    this._nextSceneType = '';

    const scene = this._sceneFactory.createScene(type);
    if (!scene) {
      console.error('failed to change scene to ' + type);
      return false;
    }

    if (this._activeScene) {
      this._activeScene.dispose();
    }

    this._activeScene = scene;

    await this._activeScene.initialize();

    this._sceneReady = true;
  }

  /**
   * Called every frame
   * @param dt
   */
  update(dt: number) {
    if (this._nextSceneType) {
      this.changeScene(this._nextSceneType);
    }

    if (this._sceneReady) {
      this._activeScene.update(dt);
    }
  }

  draw(dt: number): void {
    this._activeScene.draw(dt);
  }

  postDraw(dt: number): void {
    this._activeScene.postDraw(dt);
  }

  /**
   * When the window is resized
   */
  resize(width: number, height: number) {
    this._activeScene.resize(width, height);
  }
}
