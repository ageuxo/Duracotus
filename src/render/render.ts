import { Buffers } from "./buffers";
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

export function render(ctx: RenderCtx, program: ProgramInfo, buffers: Buffers) {
  // Render everything
  drawScene(ctx, program, buffers)

  if (ctx.loopRendering) {
    requestAnimationFrame(()=> render(ctx, program, buffers) );
  }

}