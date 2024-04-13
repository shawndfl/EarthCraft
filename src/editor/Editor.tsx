import { Engine } from '../core/Engine';
import '../css/editor.scss';
import { Canvas } from './Canvas';
import { TileSelector } from './TileSelector';

export class Editor {
  protected _container: HTMLElement;
  protected _tileSelector: TileSelector;
  protected _canvas: Canvas;

  get eng(): Engine {
    return this._eng;
  }

  constructor(protected _eng: Engine) {
    this._canvas = new Canvas(this);
    this._tileSelector = new TileSelector(this);
  }

  async initialize(root?: HTMLElement): Promise<void> {
    if (!root) {
      console.error('cannot find root element');
    }
    root.classList.remove('game-hidden');

    const urlSceneData = this.eng.urlParams.get('level');
    const sceneData = this.eng.scene.getSceneData(urlSceneData);

    this._container = (
      <div class='editor'>
        {this._tileSelector.createHtml()}
        {this._canvas.createHtml()}
      </div>
    ) as HTMLElement;
    root.append(this._container);
    this.eng.hide();
  }

  loadScene(urlSceneData: string): void {}

  play(): void {}

  update(dt: number): void {}
}
