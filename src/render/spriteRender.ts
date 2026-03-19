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
  program: WebGLProgram = -1;
  posBuffer: WebGLBuffer = -1;
  vao: WebGLVertexArrayObject = -1;
  vertices: number = 0;

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
    renderer.tagObj(vertexShader, 'spriteVert');
    if (!vertexShader) {
      throw new Error("Failed constructing vertexShader!");
      return;
    }
    const fragShader = renderer.createShader(gl.FRAGMENT_SHADER, fragSource);
    renderer.tagObj(fragShader, 'spriteFrag');
    if (!fragShader) {
      throw new Error("Failed constructing fragShader!");
      return;
    }

    const program = renderer.createProgram(vertexShader, fragShader);
    renderer.tagObj(program, 'spriteProgram');
    if (!program) {
      throw new Error("Failed constructing Program!");
      return;
    }
    this.program = program;

    this.posBuffer = gl.createBuffer();
    renderer.tagObj(this.posBuffer, 'spritePos');
    var posAttrib = gl.getAttribLocation(this.program, "position");
    gl.enableVertexAttribArray(posAttrib);

    var size = 3;
    var type = gl.FLOAT;
    var normalize = false;
    var stride = 0;
    var offset = 0;
    gl.vertexAttribPointer(posAttrib, size, type, normalize, stride, offset);

    this.vao = gl.createVertexArray();
    renderer.tagObj(this.vao, 'spriteVAO');
    gl.bindVertexArray(this.vao);

  }

  upload(renderer: Renderer, states: SpriteRenderState[]) {
    var gl = renderer.gl;

    var positions: number[] = [];
    var vertices = 0;

    states.forEach(s => {
      var verts = createQuad(s.position, 3);
      positions = positions.concat(verts);
      vertices += 6;
    })

    this.vertices = vertices;

    gl.bindVertexArray(this.vao);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.posBuffer);

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
  }

  render(renderer: Renderer) {
    var gl = renderer.gl

    gl.useProgram(this.program);

    gl.bindVertexArray(this.vao);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.posBuffer);

    gl.drawArrays(gl.LINES, 0, this.vertices);
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

function createQuad(pos: Vec, size: number) {
  var vertices: number[] = [];

  function pushVert(x: number, y: number, z: number) {
    vertices.push(x);
    vertices.push(y);
    vertices.push(z);
  }

  pushVert(pos.x, pos.y, pos.z); // a
  pushVert(pos.x, pos.y + size, pos.z); // b
  pushVert(pos.x + size, pos.y + size, pos.z); // c

  pushVert(pos.x, pos.y, pos.z); // a
  pushVert(pos.x + size, pos.y + size, pos.z); // c
  pushVert(pos.x + size, pos.y, pos.z); // d

  return vertices;
}