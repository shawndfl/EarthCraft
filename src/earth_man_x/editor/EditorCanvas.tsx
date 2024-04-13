import REACT from 'jsx-dom';
import { EditorCollision } from './EditorCollision';
import { EditorComponent } from './EditorComponent';

import vec2 from '../../math/vec2';
import rect from '../../math/rect';
import {
  DefaultLevelHeight,
  DefaultLevelWidth,
  ICollision,
  SceneData,
} from '../../data/SceneData';

export class EditorCanvas extends EditorComponent {
  private _canvas: HTMLCanvasElement;
  container: HTMLElement;
  context: CanvasRenderingContext2D;
  collisions: Map<string, EditorCollision> = new Map<string, EditorCollision>();
  sceneData: SceneData;

  public get canvas(): HTMLCanvasElement {
    return this._canvas;
  }

  async initialize(): Promise<void> {
    this.container = (<div class='editor-canvas'></div>) as HTMLElement;
    this._canvas = document.createElement('canvas');
    this._canvas.width = DefaultLevelWidth;
    this._canvas.height = DefaultLevelHeight;
    this.context = this._canvas.getContext('2d');

    this._canvas.classList.add('editor-canvas', 'canvas');
    this.container.append(this._canvas);
    this.canvas.addEventListener('mousemove', (e) => {});
  }

  /**
   * Create a new level
   */
  newLevel(): void {
    this.sceneData.reset();
    this.loadLevel(this.sceneData);
  }

  /**
   * Load a level
   * @param data
   */
  loadLevel(data: SceneData) {
    this.sceneData = data;
    this.collisions.clear();

    this._canvas.width = data.size.x;
    this._canvas.height = data.size.y;

    this.sceneData.collision.forEach((c) => {
      this.createCollision(c);
    });

    this.draw();
  }

  createCollision(collision: ICollision): EditorCollision {
    const editorCollision = new EditorCollision(collision, this.editor);
    this.collisions.set(collision.id, editorCollision);
    return editorCollision;
  }

  show(show: boolean): void {
    if (show) {
      this.container.classList.remove('game-hidden');
    } else {
      this.container.classList.add('game-hidden');
    }
  }

  draw(): void {
    this.context.clearRect(0, 0, this._canvas.width, this._canvas.height);
    this.context.fillStyle = '#505050';
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.collisions.forEach((c) => {
      c.draw(this.context);
    });
  }

  saveLevel(): void {
    /*
    const sceneType = this.editor.eng.scene.sceneType;
    const storage = window.localStorage;
    storage.setItem(sceneType + '*', this.levelData.serialize());
    console.debug('saved');
    */
  }
}
