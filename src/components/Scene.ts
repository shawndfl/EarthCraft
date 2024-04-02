import { InputState } from '../core/InputState';
import { Component } from '../components/Component';
import { Engine } from '../core/Engine';
import { LevelData } from '../data/ILevelData';
import { SceneData } from '../data/SceneData';
import * as THREE from 'three';

/**
 * This is a base class for a scene
 */
export class Scene extends Component {
  protected _inputComponents: Component[];
  protected _drawableComponents: Component[];
  protected _data: LevelData;
  protected _scene: THREE.Scene;
  private _sceneReady: boolean;

  /**
   * Is the scene ready
   */
  get isReady(): boolean {
    return this._sceneReady;
  }

  /**
   * Gets custom scene data
   */
  get sceneData(): LevelData {
    return this._data;
  }

  /**
   * constructor
   * @param eng
   */
  constructor(eng: Engine) {
    super(eng);
    this._scene = new THREE.Scene();
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
   * @param urlSceneData - The location in localStorage or a url for a remote file
   */
  queueNewScene(urlSceneData: string): void {
    this._sceneReady = false;

    // check local storage first
    const localStorage = window.localStorage.getItem(urlSceneData);
    if (localStorage) {
      this._data = JSON.parse(localStorage);
      this.initialize();
    } else {
      // try a remote call
      this.eng.remote.loadFile(urlSceneData).then((v) => {
        this._data = JSON.parse(v);
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
    this._sceneReady = true;

    this.eng.loadingScreen.reset();
  }

  reset(): void {
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
