import { Engine } from '../core/Engine';
import { InputState } from '../core/InputState';

/**
 * This is the engine override that will kick off our editor
 * or the game.
 */
export class HelloEngine extends Engine {
  constructor() {
    super();
  }

  async initialize(root?: HTMLElement): Promise<void> {
    await super.initialize(root);

    // load the first scene
    await this.scene.queueNewScene(this.urlParams.get('level') ?? 'level2');
  }

  handleUserAction(state: InputState): boolean {
    return false;
  }

  postDraw(dt: number): void {
    super.postDraw(dt);
  }

  // Used for isolated feature debugger
  /*
  update(dt: number): void {
    this.sceneManager.update(dt);
  }
  */
}
