import { PlatformEngine } from '../PlatformEngine';

import { InputState } from '../../core/InputState';
import { ParticleTest } from '../samples/ParticleTest';
import { Collision2D } from '../../physics/Collision2D';

import { CollisionFactory } from '../tiles/CollisionFactory';
import { InputHud } from '../hud/inputHud';
import { EntityFactory } from '../tiles/EntityFactory';
import { Texture } from '../../graphics/Texture';
import { Scene } from '../../components/Scene';

export class EarthManXScene extends Scene {
  private particleTest: ParticleTest;
  private collisions: Collision2D[];
  private updatableCollisions: Collision2D[];
  private inputHud: InputHud;
  private tileTexture: Texture;

  /**
   * Gets the engine
   */
  get eng(): PlatformEngine {
    return super.eng as PlatformEngine;
  }

  /**
   *
   * @param eng
   * @param _type - Format is level##
   */
  constructor(eng: PlatformEngine) {
    super(eng);

    this.particleTest = new ParticleTest(this.eng);
    this.inputHud = new InputHud(eng);
    this.tileTexture = new Texture('levelTile', this.eng.gl);
  }

  async initialize(): Promise<void> {
    console.debug('initializing Earth Man X Scene from ' + this.sceneUrl);
    //this.particleTest.initialize();
    this.inputHud.initialize();

    // set the view and the limits
    this.eng.viewManager.setXLimits(0, this.sceneData.size.x);
    this.eng.viewManager.setYLimits(0, this.sceneData.size.y);
    this.eng.physicsManager.initializeBounds(
      this.sceneData.size.x,
      this.sceneData.size.y
    );

    // setup the player for this level
    this.eng.player.loadPlayer(this.sceneData.player);

    // create the bullets
    await this.eng.bullets.initialize();

    // load all the collision
    this.collisions = [];
    this.updatableCollisions = [];
    for (let i = 0; i < this.sceneData.collision.length; i++) {
      const options = this.sceneData.collision[i];

      // create different collision types
      const collision = CollisionFactory.create(this.eng, options);
      // save the collision
      this.collisions.push(collision);
      // check if it requires an update
      if (collision.requireUpdate) {
        this.updatableCollisions.push(collision);
      }
    }

    // load the tile texture
    await this.eng.tileManager.loadTexture(this.sceneData.tileSheetUrl);

    // create the tile images
    for (let i = 0; i < this.sceneData.imageTiles.length; i++) {
      const imgData = this.sceneData.imageTiles[i];
      this.eng.tileManager.createTile(imgData);
    }

    // create the entities
    for (let i = 0; i < this.sceneData.entities.length; i++) {
      const entity = this.sceneData.entities[i];

      //TODO save components so we can search for them later
      const component = EntityFactory.create(this.eng, entity);
    }

    this._isLoading = false;
    this._sceneReady = true;
  }

  /**
   * Handle user input
   * @param action
   * @returns
   */
  handleUserAction(action: InputState): boolean {
    this.inputHud.handleUserAction(action);

    return false;
  }

  update(dt: number): void {
    if (this.isReady && this.updatableCollisions) {
      //this.particleTest.update(dt);
      this.updatableCollisions.forEach((c) => c.update(dt));
    }
  }

  draw(dt: number): void {}

  postDraw(dt: number): void {
    this.inputHud.update(dt);
  }

  dispose(): void {
    this.eng.physicsManager.reset();
    this.eng.annotationManager.reset();
    this.eng.player.reset();
    this.eng.bullets.reset();
    this.eng.enemies.reset();
    //this.eng.backgroundManager.dispose();
  }
}
