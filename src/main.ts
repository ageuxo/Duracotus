import { SimpleScene } from './physics/scene';
import { RenderCtx, Renderer } from './render/render';
import { createSceneProgram, drawScene } from './render/sceneRender';
import { createBuffers } from "./render/buffers";
import { SimpleEntity } from './physics/entities';

async function main() {

  try {

    const ctx = new RenderCtx();
    const scene = new SimpleScene();
    const sceneRenderer = new Renderer(createSceneProgram(ctx), createBuffers(ctx));

    scene.addEntity(new SimpleEntity(1, {x: 1, y: 1, z: 1}, {x: 0, y: 0, z: 0}));
    scene.addEntity(new SimpleEntity(1, {x: 1.5, y: 0.5, z: 0}, {x: 0.1, y: 0.1, z: 0}));

    updateLoop(ctx, sceneRenderer, scene, 0);

  } catch (error) {
    console.error(error);
    alert(`An unexpected error has occured: ${error}`)
  }
}

export function updateLoop(ctx: RenderCtx, renderer: Renderer, scene: SimpleScene, nowMs: number) {
  const nowSeconds = (nowMs * 0.001 /*into seconds*/);
  const deltaTime = nowSeconds - scene.lastUpdate;
  scene.lastUpdate = nowSeconds;

  scene.update(deltaTime);

  renderer.uploadData(ctx, scene);
  // Render everything
  drawScene(ctx, renderer);

  if (ctx.loopRendering) {
    requestAnimationFrame((t) => updateLoop(ctx, renderer, scene, t));
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