import { SimpleScene } from "../physics/scene";
import { Buffers, uploadFloatBuffer } from "./buffers";
import { drawScene } from "./sceneRender";
import { ProgramInfo } from "./shaders";

export interface RenderState {
  type: string;
}

export interface GLContext {
    gl: WebGL2RenderingContext;
}

export interface CanvasContext {
    canvas: HTMLCanvasElement;
}

export interface DebugContext {
  lintExt: any;
  tagObj: (obj: any, name: string) => void;
}

export class RenderCtx implements GLContext, CanvasContext, DebugContext {
  canvas: HTMLCanvasElement;
  gl: WebGL2RenderingContext;
  lintExt: any;
  tagObj: (obj: any, name: string)=> void;
  loopRendering: boolean = true;

  constructor() {
    const canvas: HTMLCanvasElement | null = document.querySelector("#gl-canvas");
    if (canvas === null) {
      throw new Error("Failure in setup. Unable to locate canvas!");
    }
    const gl = canvas.getContext("webgl2");
    if (gl === null) {
      throw new Error("Failed initializing WebGL. Your browser or machine may not support it.");
    }

    this.gl = gl;
    this.canvas = canvas;

    // Debug extension
    this.lintExt = gl.getExtension("GMAN_debug_helper");
    this.tagObj = this.lintExt ? this.lintExt.tagObject : () => {};

    this.resizeCanvas();
    document.addEventListener("resize", ()=> this.resizeCanvas() );
  }

  public resizeCanvas() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
    this.clearViewport();
  }

  public clearViewport() {
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);
  }
}

export class Renderer {
  vertices: number = 0;
  program: ProgramInfo;
  buffers: Buffers;

  constructor(program: ProgramInfo, buffers: Buffers) {
    this.program = program;
    this.buffers = buffers;
  }

  public uploadData({ gl }: GLContext, scene: SimpleScene) {
    const vertices = scene.extractVertices();
    this.vertices = Math.floor(vertices.length / 3);
    uploadFloatBuffer(gl, this.buffers.position, vertices);
  }

}

export function render(ctx: RenderCtx, renderer: Renderer, scene: SimpleScene) {
  renderer.uploadData(ctx, scene);
  // Render everything
  drawScene(ctx, renderer);

  if (ctx.loopRendering) {
    requestAnimationFrame(()=> render(ctx, renderer, scene) );
  }

}