import { mat4 } from "gl-matrix";
import { SimpleScene } from "../physics/scene";
import { Buffers, uploadFloatBuffer } from "./buffers";
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

export abstract class Renderer {
  drawElements: DrawElement[] = [];
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

  public updateTransforms(scene: SimpleScene) {
    this.entityTransforms = [];
    for (let entity of scene.entities) {
      this.entityTransforms.push(entity.makeTransform());
    }
  }

  public setViewMatrices(ctx: CanvasContext) {
    setupMatrices(ctx, this);
  }

  abstract uploadData(ctx: GLContext, scene: SimpleScene): void;
  abstract render(ctx: GLContext & CanvasContext): void;

}

export interface DrawElement {
  idxCount: number;
  byteOffset: number;
  transformIdx: number;
}

export function setupMatrices({ canvas }: CanvasContext, renderer: Renderer) {
  mat4.identity(renderer.perspectiveMatrix);
  mat4.identity(renderer.viewMatrix);

  const aspect = canvas.clientWidth / canvas.clientHeight;
  mat4.perspective(renderer.perspectiveMatrix, renderer.fov, aspect, renderer.zNear, renderer.zFar);

  mat4.translate(
    renderer.viewMatrix,
    renderer.viewMatrix,
    [-0.0, 0.0, -6.0]
  );

  mat4.scale(
    renderer.viewMatrix,
    renderer.viewMatrix,
    [0.5, 0.5, 0.5]
  );
}

export function setUpAttributes(gl: WebGL2RenderingContext, buffers: Buffers, programInfo: ProgramInfo) {
  gl.bindVertexArray(programInfo.vertexArrayObj);
  for (const attribute in programInfo.attributes) {
    setUpAttribute(gl, buffers, programInfo, attribute);
  }
}

export function enableAttributes(gl: WebGL2RenderingContext, programInfo: ProgramInfo) {
  for (const attribute in programInfo.attributes) {
    gl.enableVertexAttribArray(programInfo.attributes[attribute].location);
  }
}

function setUpAttribute(gl: WebGL2RenderingContext, buffers: Buffers, programInfo: ProgramInfo, attributeKey: keyof ProgramInfo['attributes']) {
  const { location, buffer, type, numComponents, normalise, stride, offset } = programInfo.attributes[attributeKey];

  gl.bindBuffer(gl.ARRAY_BUFFER, buffers[buffer]);
  gl.vertexAttribPointer(
    location,
    numComponents,
    type,
    normalise,
    stride,
    offset
  );
}
