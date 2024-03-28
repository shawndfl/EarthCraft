import './css/canvas.scss';
import * as t3 from 'three';

const scene: t3.Scene = new t3.Scene();


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
    
  }
  // request a new frame
  previousTimeStamp = timestamp;
}

