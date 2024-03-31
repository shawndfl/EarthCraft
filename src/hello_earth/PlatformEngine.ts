import { Engine } from '../core/Engine';
import { InputState } from '../core/InputState';
import { AssetManager } from '../systems/AssetManager';
import { SceneManager } from '../systems/SceneManager';

/**
 * This is the engine override that will kick off our editor
 * or the game.
 */
export class HelloEngine extends Engine {
  constructor() {
    super();
  }
  /*
  createSceneManager(): SceneManager {
    return new SceneManager(this, new SceneFactory(this));
  }

  createAssetManager(): AssetManager {
    return new GameAssetManager(this);
  }
*/
  async initialize(root?: HTMLElement): Promise<void> {
    await super.initialize(root);

    // load the first scene
    await this.sceneManager.changeScene(
      this.urlParams.get('level') ?? 'level2'
    );
  }

  handleUserAction(state: InputState): boolean {
    return false;
  }

  draw(dt: number): void {
    if (this.sceneManager.sceneReady) {
      this.sceneManager.update(dt);

      this.physicsManager.update(dt);

      this.tileManager.update(dt);
      this.particleManager.update(dt);
      this.dialogManager.update(dt);
      this.textManager.update(dt);
      this.annotationManager.update(dt);
    }
  }

  postDraw(dt: number): void {
    this.sceneManager.postDraw(dt);

    super.postDraw(dt);
  }

  // Used for isolated feature debugger
  /*
  update(dt: number): void {
    this.sceneManager.update(dt);
  }
  */
}
