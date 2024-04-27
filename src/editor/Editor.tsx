import { Engine } from '../core/Engine';
import '../css/editor.scss';
import { SceneData } from '../data/SceneData';
import { EditorCanvas } from './EditorCanvas';
import { EditorEntityList } from './EditorEntityList';
import { TileSelector } from './TileSelector';
import { ZoomController } from './ZoomController';

export class Editor {
  protected _container: HTMLElement;
  protected _tileSelector: TileSelector;
  protected _canvas: EditorCanvas;
  protected _sceneUrl: string;
  protected _sceneData: SceneData;
  protected _zoomController: ZoomController;

  get sceneData(): SceneData {
    return this._sceneData;
  }

  get sceneUrl(): string {
    return this._sceneUrl;
  }

  get canvas(): EditorCanvas {
    return this._canvas;
  }

  get eng(): Engine {
    return this._eng;
  }

  constructor(protected _eng: Engine) {
    this._canvas = new EditorCanvas(this);
    this._tileSelector = new TileSelector(this);
    this._zoomController = new ZoomController(this);
  }

  async initialize(root?: HTMLElement): Promise<void> {
    if (!root) {
      console.error('cannot find root element');
    }
    root.classList.remove('game-hidden');

    // create the view
    this._container = (
      <div class='editor'>
        {this._tileSelector.createHtml()}
        {this._canvas.createHtml()}
        {this._zoomController.createHtml()}
      </div>
    ) as HTMLElement;
    root.append(this._container);
    this.eng.hide();

    // load the scene
    this._sceneUrl = this.eng.urlParams.get('level');
    this._sceneData = await this.eng.scene.getSceneData(this.sceneUrl);

    this._canvas.loadScene(this._sceneData);
  }

  loadScene(urlSceneData: string): void {}

  play(): void {
    this.save(this.sceneUrl);
    this.eng.show();
    this.eng.scene.queueNewScene(this.sceneUrl);
  }

  save(sceneUrl: string): void {
    this._sceneUrl = sceneUrl;
    this._sceneData.saveLocally(this.sceneUrl);
  }

  download(): void {
    //TODO download json
  }

  update(dt: number): void {}
}
