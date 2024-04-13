import { Scene } from '../components/Scene';
import { Engine } from '../core/Engine';
import { InputState } from '../core/InputState';
import { AssetManager } from '../systems/AssetManager';
import { PlayerController } from './components/PlayerController';
import { EarthManXScene } from './scenes/EarthManXScene';
import { BulletManager } from './system/BulletManager';
import { EnemyManager } from './system/EnemyManager';
import { GameAssetManager } from './system/GameAssetManager';

/**
 * This is the engine override that will kick off our editor
 * or the game.
 */
export class PlatformEngine extends Engine {
  readonly player: PlayerController;
  readonly bullets: BulletManager;
  readonly enemies: EnemyManager;

  constructor() {
    super();
    this.player = new PlayerController(this);
    this.bullets = new BulletManager(this);
    this.enemies = new EnemyManager(this);
  }

  /**
   * Create the earth man x scene
   * @returns
   */
  createScene(): Scene {
    console.debug('creating EarthManX Scene');
    return new EarthManXScene(this);
  }

  createAssetManager(): AssetManager {
    return new GameAssetManager(this);
  }

  async initialize(root?: HTMLElement): Promise<void> {
    await super.initialize(root);

    this.player.initialize();

    await this.enemies.initialize();

    await this.bullets.initialize();

    // load the first scene
    await this.scene.queueNewScene(
      this.urlParams.get('level') ?? 'assets/level2/level.json'
    );
  }

  handleUserAction(state: InputState): boolean {
    return (
      this.dialogManager.handleUserAction(state) ||
      this.player.handleUserAction(state) ||
      this.scene.handleUserAction(state)
    );
  }

  draw(dt: number): void {
    super.draw(dt);
    this.player.update(dt);
    this.bullets.update(dt);
    this.enemies.update(dt);
  }

  // Used for isolated feature debugger
  /*
  update(dt: number): void {
    this.sceneManager.update(dt);
  }
  */

  reset(): void {
    super.reset();

    this.player.reset();
    this.bullets.reset();
    this.enemies.reset();
  }
}
