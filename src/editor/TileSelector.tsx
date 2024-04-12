import { EditorComponent } from './EditorComponent';

export class TileSelector extends EditorComponent {
  private _container: HTMLElement;

  createHtml(): HTMLElement {
    this._container = (<div class='tile-selector'></div>) as HTMLElement;
    return this._container;
  }
}
