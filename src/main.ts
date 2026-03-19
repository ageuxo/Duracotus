import { SpriteEntity } from './physics/entities';
import { SimpleScene } from './physics/scene';
import { Renderer, RenderState } from './render/render';
import './utils/webgl-lint'

async function main() {

  try {

    const renderer = new Renderer();
    const scene = new SimpleScene();

    scene.addEntity(new SpriteEntity(0, 1, { x: 0, y: 0, z: 0 }, { x: 0, y: 0, z: 0 }));
    scene.addEntity(new SpriteEntity(0, 1, { x: 2, y: 2, z: 0.8 }, { x: 0, y: 0, z: 0 }));
    scene.addEntity(new SpriteEntity(0, 1, { x: 4, y: 4, z: -0.8 }, { x: 0, y: 0, z: 0 }));

    const states: RenderState[] = [];
    scene.extractStates(states);

    renderer.upload(states);

    renderer.render();

  } catch (error) {
    console.error(error);
    alert(`An unexpected error has occured: ${error}`)
  }
}

/**
   * ms: time to sleep in milliseconds
   */
function sleep(ms: number) {
  return new Promise(res => setTimeout(res, ms));
}







document.addEventListener("DOMContentLoaded", main);