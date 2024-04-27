import { Editor } from './Editor';
import { EditorComponent } from './EditorComponent';
import { EditorEntityList } from './EditorEntityList';

export class TileSelector extends EditorComponent {
  private _container: HTMLElement;
  private _inputFile: HTMLInputElement;
  protected _entityList: EditorEntityList;

  constructor(editor: Editor) {
    super(editor);
    this._entityList = new EditorEntityList(editor);
  }

  /**
   * Create the tile selector and the add tile button
   * @returns
   */
  createHtml(): HTMLElement {
    this._inputFile = (
      <input type='file' onChange={this.uploadFile.bind(this)} hidden></input>
    ) as HTMLInputElement;

    this._container = (
      <div class='tile-selector'>
        <button onClick={this.addTile.bind(this)}>Add Tile</button>
        {this._inputFile}
        {this._entityList.createHtml()}
      </div>
    ) as HTMLElement;

    return this._container;
  }

  uploadFile(): void {
    const promise = new Promise<string>((resolve, reject) => {
      console.debug('file name ', this._inputFile.files);
      const file = this._inputFile.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        const results = reader.result as string;
        resolve(results);
      };
      reader.onerror = () => {
        reject();
      };
      reader.readAsDataURL(file);
    });

    promise.then((imageValue) => {
      // create the image with the newly updated tile
      const image = new Image();
      image.src = imageValue;

      this._entityList.addItem('test', '#ff0000', image);

      /*
      const base64Parts = results.split(',');
      var fileFormat = base64Parts[0].split(';')[1];
      var fileContent = base64Parts[1];
      var file = new File([fileContent], 'file name here', {
        type: fileFormat,
      });
      */
    });
  }

  addTile(e: MouseEvent): void {
    this._inputFile.click();
  }
}
