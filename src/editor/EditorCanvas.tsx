import REACT from 'jsx-dom';
import { EditorCollision } from './EditorCollision';
import { EditorComponent } from './EditorComponent';

import vec2 from '../math/vec2';
import rect from '../math/rect';
import {
  DefaultLevelHeight,
  DefaultLevelWidth,
  ICollision,
  SceneData,
} from '../data/SceneData';
import { Editor } from './Editor';
import { clamp } from '../math/constants';

export class EditorCanvas extends EditorComponent {
  private _canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
  collisions: Map<string, EditorCollision> = new Map<string, EditorCollision>();
  sceneData: SceneData;
  private _zoomScale: number = 1;
  private _pan: vec2 = new vec2();
  private isDragging: boolean = false;
  private mouseLast: vec2 = new vec2();
  /** Where the mouse cursor is while we are zooming */
  private zoomTarget: vec2 = new vec2();
  private mouseCurrent: vec2 = new vec2();
  private minZoom: number = 0.2;
  private maxZoom: number = 1.5;

  private _sceneSize: vec2 = new vec2(DefaultLevelWidth, DefaultLevelHeight);

  private boundResize;
  private boundMouseDown;
  private boundMouseMove;
  private boundMouseUp;

  public get sceneSize(): Readonly<vec2> {
    return this._sceneSize;
  }

  public get canvas(): HTMLCanvasElement {
    return this._canvas;
  }

  constructor(editor: Editor) {
    super(editor);
    this.boundResize = this.resize.bind(this);
    this.boundMouseDown = this.mouseDown.bind(this);
    this.boundMouseMove = this.mouseMove.bind(this);
    this.boundMouseUp = this.mouseUp.bind(this);

    this._canvas = document.createElement('canvas');
    this._canvas.tabIndex = 0;
    this.context = this._canvas.getContext('2d');

    this._canvas.classList.add('editor-canvas', 'canvas');
    this._canvas.addEventListener('mousedown', this.boundMouseDown);
    this._canvas.addEventListener('mousemove', this.boundMouseMove);
    this._canvas.addEventListener('mouseup', this.boundMouseUp);
    this._canvas.addEventListener('wheel', (e) => {
      this.mouseWheel(e);
    });

    window.removeEventListener('resize', this.boundResize);
    window.addEventListener('resize', this.boundResize);
  }

  createHtml(): HTMLElement {
    return this._canvas;
  }

  mouseWheel(e: WheelEvent): void {
    e.preventDefault();
    this.zoomTarget.x = e.x;
    this.zoomTarget.y = e.y;
    const delta = e.deltaY * 0.01;
    this._zoomScale += delta;
    this._zoomScale = clamp(this._zoomScale, this.minZoom, this.maxZoom);
    this.draw();
  }

  mouseDown(e: MouseEvent): void {
    console.debug('down', e);
    this.isDragging = true;
    this.mouseLast.x = e.x;
    this.mouseLast.y = e.y;
  }

  mouseMove(e: MouseEvent): void {
    //console.debug('move', e);
    if (this.isDragging) {
      this.mouseCurrent.x = e.x;
      this.mouseCurrent.y = e.y;
      const delta = this.mouseCurrent.subtract(this.mouseLast);
      this.mouseLast.x = e.x;
      this.mouseLast.y = e.y;

      this._pan.add(delta);
      this.draw();
    }
  }

  mouseUp(e: MouseEvent): void {
    console.debug('up  ', e);
    this.isDragging = false;
    this.mouseLast.reset();
  }

  resize(): void {
    this.draw();
  }

  setSceneSize(width: number, height: number): void {
    this._sceneSize.x = width;
    this._sceneSize.y = height;
  }

  async initialize(): Promise<void> {}

  /**
   * Create a new level
   */
  newLevel(): void {
    this.sceneData.reset();
    this.loadScene(this.sceneData);
  }

  /**
   * Load a level
   * @param data
   */
  loadScene(data: SceneData) {
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
      this._canvas.classList.remove('game-hidden');
    } else {
      this._canvas.classList.add('game-hidden');
    }
  }

  draw(): void {
    const bounds = this._canvas.getBoundingClientRect();
    this._canvas.width = bounds.width;
    this._canvas.height = bounds.height;

    // clear background
    this.context.transform(1, 0, 0, 1, 0, 0);
    this.context.clearRect(0, 0, this._sceneSize.x, this._sceneSize.y);

    // clamp the panning
    const zoomPercentage =
      (this._zoomScale - this.minZoom) / (this.maxZoom - this.minZoom);
    console.debug('zoom % ' + zoomPercentage + ' diff ' + this.zoomTarget.x);
    let x = this._pan.x;
    let y = this._pan.y;
    x = clamp(x, -this._sceneSize.x, 0);
    y = clamp(y, 0, this._sceneSize.y);

    // set the fill for the background
    this.context.fillStyle = '#505050';
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // do the transform
    this.context.transform(this._zoomScale, 0, 0, this._zoomScale, x, y);

    this.collisions.forEach((c) => {
      c.draw(this.context);
    });

    this.context.transform(1, 0, 0, 1, 0, 0);
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
