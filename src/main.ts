import { SimpleScene } from './physics/scene';
import { RenderCtx, Renderer } from './render/render';
import { SimpleEntity } from './physics/entities';
import { InputHandler } from './input/input';
import { KeySets } from './input/keybinds';
import { loadTexture } from './render/textures';
import sprites from './sprites.png';
import { SpriteRenderer } from './render/spriteRender';

async function main() {

  try {

    const ctx = new RenderCtx();
  
    const scene = new SimpleScene();

    const spriteRenderer = new SpriteRenderer(ctx);
    spriteRenderer.init(ctx);

    const atlas = loadTexture(ctx, sprites);

    const inputHandler = new InputHandler(ctx);
    const keySets = new KeySets(scene);
    inputHandler.addListenerSet(keySets.simulation);
    addKeyBindings(inputHandler);

    scene.addEntity(new SimpleEntity(1, [1, 1, 1]));
    scene.addEntity(new SimpleEntity(1, [3.5, 1.75, 0]));

    updateLoop(ctx, spriteRenderer, scene, 0);

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
  renderer.setViewMatrices(ctx);
  // Render everything
  renderer.render(ctx);

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