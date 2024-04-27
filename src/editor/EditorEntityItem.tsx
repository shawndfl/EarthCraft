import REACT from 'jsx-dom';
import { EditorComponent } from './EditorComponent';
import { Editor } from './Editor';

/**
 * Item in the entity list
 */
export class EditorEntityItem extends EditorComponent {
  private _container: HTMLElement;

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
  }

  createHtml(): HTMLElement {
    this._container = (
      <div class='item' onClick={this.onClick.bind(this)}>
        <div class='color' style={{ backgroundColor: this._color }}>
          &nbsp;
        </div>
        <div class='title'>{this.name}</div>
        {this.image}
      </div>
    ) as any as HTMLElement;
    return this._container;
  }

  protected onClick(): EditorEntityItem {
    return this;
  }
}
