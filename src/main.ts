import { SimpleScene } from './physics/scene';
import { render, RenderCtx, Renderer } from './render/render';
import { createSceneProgram } from './render/sceneRender';
import { createBuffers } from "./render/buffers";
import { SimpleEntity } from './physics/entities';

async function main() {

  try {

    const ctx = new RenderCtx();
    const scene = new SimpleScene();
    const sceneRenderer = new Renderer(createSceneProgram(ctx), createBuffers(ctx));

    scene.addEntity(new SimpleEntity(1, {x: 1, y: 1, z: 1}, {x: 0, y: 0, z: 0}));
    scene.addEntity(new SimpleEntity(1, {x: 1.5, y: 0.5, z: 0}, {x: 0.1, y: 0.1, z: 0}));

    render(ctx, sceneRenderer, scene);

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

// ENTRY POINT
document.addEventListener("DOMContentLoaded", main);