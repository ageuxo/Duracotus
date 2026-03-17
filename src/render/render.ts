
import { SpriteRenderer, SpriteRenderState } from "./spriteRender";


export interface RenderState {
  type: string;
}

export class Renderer {
  canvas: HTMLCanvasElement;
  gl: WebGL2RenderingContext;
  states: RenderState[] = [];
  spriteRenderer = new SpriteRenderer(32, 128);

  public init() {
    this.setupGL();
    this.resizeCanvas();
    document.addEventListener("resize", ()=> this.resizeCanvas() );

    this.spriteRenderer.init(this);

  }

  public upload() {
    const sprites: SpriteRenderState[] = [];

    this.states.forEach(s => {
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
    this.spriteRenderer.render(this);
  }

  public setupGL() {
    const canvas: HTMLCanvasElement | null = document.querySelector("#gl-canvas");
    if (canvas === null) {
      alert("Failure in setup. Unable to locate canvas!");
      return;
    }
    this.canvas = canvas;
    const gl = canvas.getContext("webgl2");
    if (gl === null) {
      alert("Failed initializing WebGL. Your browser or machine may not support it.");
      return;
    }
    this.gl = gl;

    this.gl.clearColor(0, 0, 0, 1);
    this.clearViewport();
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
    this.gl.shaderSource(shader, source);
    this.gl.compileShader(shader);

    var success = this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS);

    if (success) {
      return shader;
    } else {
      console.log(this.gl.getShaderInfoLog(shader));
      this.gl.deleteShader(shader);
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
      console.log(this.gl.getProgramInfoLog(program));
      this.gl.deleteProgram(program);
    }
    
  }

}

