import { SimpleScene } from './physics/scene';
import { RenderCtx, Renderer } from './render/render';
import { createSceneProgram, drawScene } from './render/sceneRender';
import { setupMatrices } from "./render/render";
import { createBuffers } from "./render/buffers";
import { SimpleEntity } from './physics/entities';
import { InputHandler } from './input/input';
import { KeySets } from './input/keybinds';

async function main() {

  try {

    const ctx = new RenderCtx();
    const scene = new SimpleScene();
    const sceneRenderer = new Renderer(createSceneProgram(ctx), createBuffers(ctx));
    sceneRenderer.init(ctx);

    const inputHandler = new InputHandler(ctx);
    const keySets = new KeySets(scene);
    inputHandler.addListenerSet(keySets.simulation);
    addKeyBindings(inputHandler);
    
    setupMatrices(ctx, sceneRenderer);

    scene.addEntity(new SimpleEntity(1, [1, 1, 1]));
    scene.addEntity(new SimpleEntity(1, [1.5, 0.5, 0]));

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
  renderer.updateTransforms(scene);
  // Render everything
  drawScene(ctx, renderer);

  if (ctx.loopRendering) {
    requestAnimationFrame((t) => updateLoop(ctx, renderer, scene, t));
  }

}

function addKeyBindings(inputHandler: InputHandler) {
  inputHandler.addBinding('Space', {
      keybind: 'sim.pause',
      modifiers: [
        {
          Control: false,
          Alt: false,
          Shift: false,
          Meta: false
        }
      ]
    });
}

/**
   * ms: time to sleep in milliseconds
   */
function sleep(ms: number) {
  return new Promise(res => setTimeout(res, ms));
}

export function forEachPair(array: any[], callback: (a: any, b: any) => void) {
    for (let i = 0; i < array.length; i++) {
        for (let j = i + 1; j < array.length; j++) {
            callback(array[i], array[j]);
        }
    }
}

// ENTRY POINT
document.addEventListener("DOMContentLoaded", main);