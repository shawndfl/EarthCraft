import { ICollision } from '../data/SceneData';
import { Editor } from './Editor';
import { EditorComponent } from './EditorComponent';

export class EditorCollision extends EditorComponent {
  get id(): string {
    return this._collision.id;
  }

  get type(): string {
    return this._collision.type;
  }

  get meta(): Map<string, string> {
    return this._collision.meta;
  }

  constructor(protected _collision: ICollision, editor: Editor) {
    super(editor);
  }

  draw(context: CanvasRenderingContext2D): void {
    const box = this._collision.box;
    context.fillStyle = '#ff0000';
    const height = this.editor.canvas.canvas.height;
    context.fillRect(box.left, height - box.top, box.width, box.height);
  }

  createHtml(): HTMLElement {
    //NOP The EditorCanvas creates HTML
    return null;
  }
}
