import { EditorComponent } from './EditorComponent';
import { EditorEntityItem } from './EditorEntityItem';
import REACT from 'jsx-dom';
import { Editor } from './Editor';

export class EditorEntityList extends EditorComponent {
  items: EditorEntityItem[];
  container: HTMLElement;

  constructor(editor: Editor) {
    super(editor);
  }

  createHtml(): HTMLElement {
    this.container = (<div class='editor-entities'></div>) as HTMLElement;
    return this.container;
  }

  addItem(
    name: string,
    color: string,
    image: HTMLImageElement
  ): EditorEntityItem {
    const newItem = new EditorEntityItem(name, image, color, this.editor);
    this.container.append(newItem.container);
    return newItem;
  }

  show(show: boolean): void {
    if (show) {
      this.container.classList.remove('game-hidden');
    } else {
      this.container.classList.add('game-hidden');
    }
  }
}
