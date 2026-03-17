import { Renderer } from './render/render';

function main() {

  const renderer = new Renderer();

  renderer.init();

  renderer.upload();
  
  renderer.render();

}







document.addEventListener("DOMContentLoaded", main);