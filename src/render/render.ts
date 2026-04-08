import { mat4 } from "gl-matrix";
import { SimpleScene } from "../physics/scene";
import { Buffers, uploadFloatBuffer } from "./buffers";
import { ProgramInfo } from "./shaders";
import { enableAttributes, setUpAttributes } from "./sceneRender";

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
  drawCount: number = 0;
  program: ProgramInfo;
  buffers: Buffers;
  perspectiveMatrix = mat4.create();
  viewMatrix = mat4.create();
  modelViewMatrix = mat4.create();
  entityTransforms: mat4[] = [];
  fov = (45 * Math.PI) / 180;
  zNear = 0.1;
  zFar = 100.0;

  constructor(program: ProgramInfo, buffers: Buffers) {
    this.program = program;
    this.buffers = buffers;
  }

  public init({ gl }: GLContext) {
    setUpAttributes(gl, this.buffers, this.program);
    enableAttributes(gl, this.program);
  }

  public uploadData({ gl }: GLContext, scene: SimpleScene) {
    const { vertices, indices, colours } = scene.extractRenderData();
    this.drawCount = indices.length;
    
    // Upload indices
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.buffers.indices);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

    uploadFloatBuffer(gl, this.buffers.position, vertices);
    uploadFloatBuffer(gl, this.buffers.colour, colours);
  }

  public updateTransforms(scene: SimpleScene) {
    this.entityTransforms = [];
    for (let entity of scene.entities) {
      this.entityTransforms.push(entity.makeTransform());
    }
  }

}
