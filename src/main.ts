import vert from './scene.vert';
import frag from './scene.frag';

function main() {
  const { canvas, gl } = setupGL();

  resizeCanvas(canvas, gl);
  document.addEventListener("resize", ()=> resizeCanvas(canvas, gl) );

}

function setupGL() {
  const canvas: HTMLCanvasElement | null = document.querySelector("#gl-canvas");
  if (canvas === null) {
    alert("Failure in setup. Unable to locate canvas!");
    return;
  }
  const gl = canvas.getContext("webgl2");
  if (gl === null) {
    alert("Failed initializing WebGL. Your browser or machine may not support it.");
    return;
  }

  gl.clearColor(0, 0, 0, 1);
  gl.clear(gl.COLOR_BUFFER_BIT);

  return {canvas, gl}
}

function resizeCanvas(canvas: HTMLCanvasElement, gl: WebGL2RenderingContext) {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  gl.clear(gl.COLOR_BUFFER_BIT);
}

function clearViewport(gl: WebGL2RenderingContext) {
  gl.clear(gl.COLOR_BUFFER_BIT);
}

document.addEventListener("DOMContentLoaded", main);