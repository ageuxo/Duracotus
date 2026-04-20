import { SimpleScene } from "../physics/scene";
import { KeyListenerSet } from "./input";

export class KeySets {
  simulation: KeyListenerSet;

  constructor(scene: SimpleScene) {
    this.simulation = simulationKeybinds(scene);
  }
}

function simulationKeybinds(scene: SimpleScene) {
  return new KeyListenerSet('simulation', {
    Space: (s) => {
      if (s == "Down") {
        scene.paused = !scene.paused;
      }
    }
  })
}