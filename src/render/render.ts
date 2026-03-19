import { SpriteRenderer, SpriteRenderState } from "./spriteRender";

export interface RenderState {
  type: string;
}

export class Renderer {
  canvas: HTMLCanvasElement;
  gl: WebGL2RenderingContext;
  states: RenderState[] = [];
  spriteRenderer = new SpriteRenderer(32, 128);
  tagObj: (object: any, name: string) => void;
  lintExt: any;

  constructor() {
    var { gl, canvas } = this.setupGL();
    this.gl = gl;
    this.canvas = canvas;

    this.lintExt = gl.getExtension("GMAN_debug_helper");
    this.tagObj = this.lintExt ? this.lintExt.tagObject : () => {};

    this.gl.clearColor(0, 0, 0, 1);

    this.resizeCanvas();
    document.addEventListener("resize", ()=> this.resizeCanvas() );

    this.spriteRenderer.init(this);

  }

  public upload(allStates: RenderState[]) {
    const sprites: SpriteRenderState[] = [];

    allStates.forEach(s => {
      switch (s.type) {
        case "sprite":
          sprites.push(s as SpriteRenderState);
          break;
      
        default:
          break;
      }
    })


    this.spriteRenderer.upload(this, sprites);
  }

  public render() {
    this.clearViewport();
    this.spriteRenderer.render(this);
    /* const info = this.lintExt.getAndResetRedundantCallInfo();
    console.log(JSON.stringify(info)); */
    requestAnimationFrame(()=>this.render());
  }

  public setupGL() {
    const canvas: HTMLCanvasElement | null = document.querySelector("#gl-canvas");
    if (canvas === null) {
      throw new Error("Failure in setup. Unable to locate canvas!");
    }
    const gl = canvas.getContext("webgl2");
    if (gl === null) {
      throw new Error("Failed initializing WebGL. Your browser or machine may not support it.");
    }

    return {gl, canvas};
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

  public createShader(type: GLenum, source: string) {
    var shader = this.gl.createShader(type);
    if (!shader) {
      throw new Error("Failed constructing shader!");
    }
    this.gl.shaderSource(shader, source);
    this.gl.compileShader(shader);

    var success = this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS);

    if (success) {
      return shader;
    } else {
      var error = this.gl.getShaderInfoLog(shader);
      this.gl.deleteShader(shader);
      throw new Error(`Failed compiling shader: ${error}`);
    }
  }

  public createProgram(vertShader: WebGLShader, fragShader: WebGLShader) {
    const program = this.gl.createProgram();

    this.gl.attachShader(program, vertShader);
    this.gl.attachShader(program, fragShader);

    this.gl.linkProgram(program);

    var success = this.gl.getProgramParameter(program, this.gl.LINK_STATUS);
    if (success) {
      return program;
    } else {
      var error = this.gl.getProgramInfoLog(program);
      this.gl.deleteProgram(program);
      throw new Error(`Failed linking program: ${error}`);
    }
    
  }

}

