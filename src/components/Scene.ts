import { InputState } from '../core/InputState';
import { Component } from '../components/Component';
import { Engine } from '../core/Engine';
import { SceneData } from '../data/SceneData';

/**
 * This the scene that will be rended. It can be data driven by calling
 * queueNewScene()
 */
export class Scene extends Component {
  protected _data: SceneData;
  protected _sceneReady: boolean;
  protected _isLoading: boolean;
  private _sceneUrl: string;

  get sceneUrl(): string {
    return this._sceneUrl;
  }

  /**
   * Get the scene data
   */
  get sceneData(): SceneData {
    return this._data;
  }

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
   * constructor
   * @param eng
   */
  constructor(eng: Engine) {
    super(eng);
    console.debug('creating scene');
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
   * Gets the scene data from local storage or a remote endpoint
   * @param urlSceneData
   * @returns
   */
  async getSceneData(urlSceneData: string): Promise<SceneData> {
    return SceneData.loadFrom(urlSceneData);
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

    this._sceneUrl = urlSceneData;
    // now we are in a loading state
    this._isLoading = true;
    this._sceneReady = false;

    this.getSceneData(urlSceneData).then((sceneData) => {
      this._data = sceneData;
      this.initialize();
    });
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
   * Sets up the scene
   */
  async initialize(): Promise<void> {}

  /**
   * The derived class can use this to keep track of components that get
   * created from the scene data.
   * @param sceneData
   * @returns
   */
  async createComponents(sceneData: SceneData): Promise<Component> {
    return null;
  }

  /**
   * Restarts the scene. Calls Engine.reset() then queue the scene again
   */
  restart(): void {
    this.eng.reset();
    this.queueNewScene(this.sceneUrl);
  }

  /**
   * Resets stuff related to the scene. The Engine.reset() will handle
   * all other systems
   */
  reset(): void {}

  /**
   * When the window is resized
   */
  resize(width: number, height: number): void {}

  /**
   * Dispose the scene
   */
  dispose(): void {}
}
