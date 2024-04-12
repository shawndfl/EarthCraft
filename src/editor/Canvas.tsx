import { EditorComponent } from './EditorComponent';

/**
 * The canvas used by the editor
 */
export class Canvas extends EditorComponent {
  protected _canvas: HTMLCanvasElement;

  createHtml(): HTMLElement {
    this._canvas = (<canvas class='editor'></canvas>) as HTMLCanvasElement;
    return this._canvas;
  }
}
