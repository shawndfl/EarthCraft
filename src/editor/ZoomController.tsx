import { EditorComponent } from './EditorComponent';
import REACT from 'jsx-dom';

export class ZoomController extends EditorComponent {
  createHtml(): HTMLElement {
    const container = (
      <div class='zoom-container'>
        <button onClick={(e) => this.zoomIn(e)}>ZoomIn</button>
        <button onClick={(e) => this.zoomOut(e)}>ZoomOut</button>
      </div>
    ) as HTMLElement;

    return container;
  }

  zoomIn(e: MouseEvent) {
    this._editor.canvas.zoom(0.1);
  }

  zoomOut(e: MouseEvent) {
    this._editor.canvas.zoom(-0.1);
  }
}
