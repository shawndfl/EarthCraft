import { Engine } from '../core/Engine';
import { Editor } from './Editor';

/**
 * Base class for editor HTML components
 */
export abstract class EditorComponent {
  /**
   * The game engine
   */
  get eng(): Engine {
    return this._editor.eng;
  }

  /**
   * The editor
   */
  get editor(): Editor {
    return this._editor;
  }

  constructor(protected _editor: Editor) {}

  abstract createHtml(): HTMLElement;
}
