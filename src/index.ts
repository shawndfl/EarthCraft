import './css/canvas.scss';
import { PlatformEngine } from './earth_man_x/PlatformEngine';
import { GameEditor } from './earth_man_x/editor/GameEditor';

const example = document.location.hash;

/**
 * Start earth man x
 */
if (example.toLocaleLowerCase().replace(/\?.*$/, '') === '#earth_man_x') {
  /**
   * Create the only instance of a canvas controller
   */
  const engine = new PlatformEngine();
  const editor = new GameEditor(engine);

  /** time tracking variables */
  let previousTimeStamp: number;

  function step(timestamp: number) {
    window.requestAnimationFrame(step);

    // save the start time
    if (previousTimeStamp === undefined) {
      previousTimeStamp = timestamp;
    }

    // calculate the elapsed
    const elapsed = timestamp - previousTimeStamp;

    // if the frame tool longer than 20ms through it out
    if (elapsed < 50) {
      // update the scene
      engine.update(elapsed);
      // update the editor
      editor.update(elapsed);
    }
    // request a new frame
    previousTimeStamp = timestamp;
  }

  /**
   * Start the engine then request and animation frame
   */
  engine
    .initialize(document.getElementById('game-container'))
    .then(() => {
      // initialize the editor
      editor
        .initialize(document.getElementById('editor-container'))
        // then request the first animation frame
        .then(() => window.requestAnimationFrame(step));
    })
    .catch((e: any) => {
      console.error('Error initializing ', e);
    });
}
