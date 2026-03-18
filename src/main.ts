import { SpriteEntity } from './physics/entities';
import { SimpleScene } from './physics/scene';
import { Renderer, RenderState } from './render/render';

function main() {

  const renderer = new Renderer();
  const scene = new SimpleScene();

  renderer.init();

  scene.addEntity(new SpriteEntity(0, 1, {x: 0, y: 0, z: 0}, {x: 0, y: 0, z: 0}));

  const states: RenderState[] = [];
  scene.extractStates(states);

  renderer.upload();
  
  renderer.render();

}







document.addEventListener("DOMContentLoaded", main);