import { InputState } from '../core/InputState';
import { Component } from '../components/Component';
import { Engine } from '../core/Engine';
import { IComponentData, SceneData } from '../data/SceneData';
import { CollisionTile, CollisionTileArgs } from './CollisionTile';

/**
 * This the scene that will be rended. It can be data driven by calling
 * queueNewScene()
 */
export class Scene extends Component {
  protected _inputComponents: Component[];
  protected _drawableComponents: Component[];
  protected _data: SceneData;
  private _sceneReady: boolean;
  private _isLoading: boolean;

  private _components: Component[];

  /**
   * Is the scene ready
   */
  get isReady(): boolean {
    return this._sceneReady;
  }

  get isLoading(): boolean {
    return this._isLoading;
  }

  /**
   * Gets custom scene data
   */
  get sceneData(): SceneData {
    return this._data;
  }

  /**
   * constructor
   * @param eng
   */
  constructor(eng: Engine) {
    super(eng);
    console.debug('creating scene');
    this._components = [];
  }

  /**
   * Get a component of a given id
   * @param id
   * @returns
   */
  getComponent(id: string): Component {
    return this._components.find((c) => c.id === id);
  }
  /**
   * Handles user input. The logic goes through a chain of commands
   * @param action the action from keyboard or gamepad
   * @returns True if the action was handled else false
   */
  handleUserAction(action: InputState): boolean {
    return false;
  }

  /**
   * This function will load a new scene. It will first try localStorage
   * If the data is not found there it will then try using a remote call.
   * This is a fire and forget function. Once it's called the scene will go into a loading state
   * and everything will stop rendering except for the loading screen.
   *
   *
   * @param urlSceneData - The location in localStorage or a url for a remote file
   */
  queueNewScene(urlSceneData: string): void {
    console.debug('loading new scene ' + urlSceneData);
    // if we are already loading don't do anything else
    if (this._isLoading) {
      return;
    }

    // now we are in a loading state
    this._isLoading = true;
    this._sceneReady = false;

    // check local storage first
    const localStorage = window.localStorage.getItem(urlSceneData);
    if (localStorage) {
      console.debug('loading scene from local storage');
      this._data = JSON.parse(localStorage);
      this.initialize();
    } else {
      // try a remote call
      console.debug('remote loading...');
      this.eng.remote.loadFile(urlSceneData).then((v) => {
        this._data = JSON.parse(v);
        console.debug('got scene response', this._data);
        this.initialize();
      });
    }
  }

  /**
   * Called every frame
   * @param dt
   */
  update(dt: number): void {}

  /**
   * Call after other systems were updated
   * @param dt
   */
  draw(dt: number): void {}

  /**
   * Called after draw
   * @param dt
   */
  postDraw(dt: number): void {}

  /**
   * Show scene is called when a SceneManager changes to a new scene.
   */
  async initialize(): Promise<void> {
    console.debug('initializing scene...');
    // must have data
    if (!this._data) {
      console.error('no data call queueNewScene() first');
      return;
    }

    // reset the scene
    this.reset();

    console.debug(
      'processing ' + this._data.components.length + ' components...'
    );
    const promises = [];
    for (let i = 0; i < this._data.components.length; i++) {
      promises.push(this.createComponent(this._data.components[i]));
    }

    // let all the components initialize
    await Promise.all(promises).then((c) => {
      this._components = c.slice();

      // let each component know the scene is loaded
      for (let i = 0; i < this._components.length; i++) {
        this._components[i].onSceneLoaded();
      }

      // now the scene is ready
      this._sceneReady = true;
      this._isLoading = false;

      // reset the loading screen
      this.eng.loadingScreen.reset();
    });
  }

  async createComponent(data: IComponentData): Promise<Component> {
    console.debug('   creating Component: ' + data?.type + '...');
    let component: Component;
    switch (data.type) {
      case 'CollisionTile':
        component = await new CollisionTile(this.eng).initialize(
          data as CollisionTileArgs
        );
        break;
    }

    return component;
  }

  reset(): void {
    this._components.forEach((c) => {
      c.dispose();
    });

    this._components = [];

    this.eng.physicsManager.reset();
    //TODO reset all systems
  }

  /**
   * When the window is resized
   */
  resize(width: number, height: number): void {}

  /**
   * Dispose the scene
   */
  dispose(): void {}
}
