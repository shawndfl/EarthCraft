import REACT from 'jsx-dom';
import { EditorComponent } from './EditorComponent';
import { Editor } from './Editor';

/**
 * Item in the entity list
 */
export class EditorEntityItem extends EditorComponent {
  container: HTMLElement;
  protected _onClick: () => void;

  public get name(): string {
    return this._name;
  }

  public get image(): HTMLImageElement {
    return this._image;
  }

  constructor(
    private _name: string,
    private _image: HTMLImageElement,
    private _color: string,
    editor: Editor
  ) {
    super(editor);
    this.image;
  }

  createHtml(): HTMLElement {
    this.container = (
      <div class='item'>
        <div class='color' style={{ backgroundColor: this._color }}>
          &nbsp;
        </div>
        <div class='title'>{this.name}</div>
        {this.image}
      </div>
    ) as any as HTMLElement;
    return this.container;
  }

  onClick(onClick: () => void): EditorEntityItem {
    this._onClick = onClick.bind(this);
    this.container.addEventListener('click', this._onClick);
    return this;
  }
}
