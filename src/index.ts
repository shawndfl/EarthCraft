import { Engine } from './core/Engine';
import './css/canvas.scss';
import { PlatformEngine } from './earth_man_x/PlatformEngine';
import { HelloEngine } from './hello_earth/HelloEngine';

const example = document.location.hash;
let engine: Engine;

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
    // then request the first animation frame
    window.requestAnimationFrame(step);
  })
  .catch((e: any) => {
    console.error('Error initializing ', e);
  });
