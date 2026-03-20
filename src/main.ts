import { SimpleScene } from './physics/scene';
import { render, RenderCtx } from './render/render';
import { createSceneProgram } from './render/sceneRender';
import { createBuffers } from "./render/buffers";

async function main() {

  try {

    const ctx = new RenderCtx();
    const scene = new SimpleScene();

    const sceneProgram = createSceneProgram(ctx);

    const buffers = createBuffers(ctx);

    render(ctx, sceneProgram, buffers);

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