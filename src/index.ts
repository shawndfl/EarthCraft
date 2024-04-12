import { Engine } from './core/Engine';
import './css/canvas.scss';
import { PlatformEngine } from './earth_man_x/PlatformEngine';
import { Editor } from './editor/Editor';
import { HelloEngine } from './hello_earth/HelloEngine';

const example = document.location.hash;
let engine: Engine;
let editor: Editor;

/**
 * Start earth man x
 */
if (example.toLocaleLowerCase() === '#earth_man_x') {
  engine = new PlatformEngine();
}

/**
 * Start hello earth
 */
if (example.toLocaleLowerCase() === '#hello_earth') {
  engine = new HelloEngine();
}

/**
 * Create the editor if the url says to
 */
if (engine.urlParams.get('editor') == 'true') {
  editor = engine.createEditor();
}

/** time tracking variables */
let previousTimeStamp: number;

/**
 * Main update function
 * @param timestamp
 */
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
    // update the editor if needed
    if (editor) {
      editor.update(elapsed);
    }
    // update the scene
    engine.update(elapsed);
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
    // initialize the editor before requesting the first frame
    if (editor) {
      editor
        .initialize(document.getElementById('editor-container'))
        .then(() => {
          window.requestAnimationFrame(step);
        });
    }
    // just request the next frame
    else {
      // then request the first animation frame
      window.requestAnimationFrame(step);
    }
  })
  .catch((e: any) => {
    console.error('Error initializing ', e);
  });
