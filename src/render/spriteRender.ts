import { Vec } from "../physics/physics";
import { Renderer, RenderState } from "./render";
import vertSource from './sprite.vert';
import fragSource from './sprite.frag';

interface AtlasSize {
  width: number,
  height: number
}

export class SpriteRenderer {
  spriteSize: AtlasSize;
  sheetSize: AtlasSize;
  program: WebGLProgram;
  posBuffer: WebGLBuffer;
  vao: WebGLVertexArrayObject;
  vertices: number;

  constructor(spriteSize: number, sheetSize: number) {
    this.spriteSize = {
      width: spriteSize,
      height: spriteSize
    };
    this.sheetSize = {
      width: sheetSize,
      height: sheetSize
    };
  }

  getSpriteCoord(id: number): Vec2 {
    const { height: sheetHeight } = this.sheetSize;
    const { height: spriteHeight } = this.spriteSize;
    
    const rows = sheetHeight/spriteHeight;

    const row = id / rows;
    const column = id % rows;

    return {
      x: Math.floor(row),
      y: Math.floor(column)
    };
  }

  init(renderer: Renderer) {
    const gl = renderer.gl;
    const vertexShader = renderer.createShader(gl.VERTEX_SHADER, vertSource);
    const fragShader = renderer.createShader(gl.FRAGMENT_SHADER, fragSource);

    this.program = renderer.createProgram(vertexShader, fragShader);

    this.posBuffer = gl.createBuffer();
    var posAttrib = gl.getAttribLocation(this.program, "position");
    gl.enableVertexAttribArray(posAttrib);

    this.vao = gl.createVertexArray();
    gl.bindVertexArray(this.vao);


    var size = 3;
    var type = gl.FLOAT;
    var normalize = false;
    var stride = 0;
    var offset = 0;
    gl.vertexAttribPointer(posAttrib, size, type, normalize, stride, offset);

  }

  upload(renderer: Renderer, states: SpriteRenderState[]) {
    var gl = renderer.gl;

    var positions: number[];

    states.forEach(s => {
      positions.push(s.position.x);
      positions.push(s.position.y);
      positions.push(s.position.z);
    })

    gl.bindBuffer(gl.ARRAY_BUFFER, this.posBuffer);

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
  }

  render(renderer: Renderer) {
    var gl = renderer.gl

    gl.useProgram(this.program);

    gl.bindVertexArray(this.vao);

    gl.drawArrays(gl.TRIANGLES, 0, this.vertices);
  }
  

}

export interface Vec2 {
  x: number,
  y: number
}

export interface SpriteRenderState extends RenderState {
  sprite: number,
  position: Vec
}