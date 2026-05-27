import { CanvasContext, DrawElement, GLContext, Renderer, RenderState } from "./render";
import { createProgram, createShader, ProgramInfo, UniformLookup } from "./shaders";
import { mat4, vec2 } from "gl-matrix";
import vertSource from './sprite.vert';
import fragSource from './sprite.frag';
import { Buffers, uploadFloatBuffer } from "./buffers";
import { SimpleScene } from "../physics/scene";
import { quad } from "./meshes";

export class SpriteRenderer extends Renderer {
  isSetUp: boolean = false;

  constructor(ctx: GLContext) {
    super(createSpriteProgram(ctx), createSpriteBuffers(ctx));
  }

  render(gl: GLContext & CanvasContext): void {
    drawSprites(gl, this)
  }

  uploadData(ctx: GLContext, scene: SimpleScene): void {
    const { gl } = ctx;
    const { drawElements, vertices, texCoords, indices } = extractSpriteData(scene);
    this.drawElements = drawElements;
    
    // Upload indices
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.buffers.indices);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

    uploadFloatBuffer(gl, this.buffers.position, vertices);
    uploadFloatBuffer(gl, this.buffers.texCoord, texCoords);
  }
}

function extractSpriteData(scene: SimpleScene) {
  const drawElements: DrawElement[] = [];
  const vertices: number[] = [];
  const texCoords: number[] = [];
  const indices: number[] = [];

  let idxOffset = 0;
  let byteOffset = 0;

  scene.entities.forEach((e, i)=> {
    quad.vertices.forEach(v => vertices.push(...v));
    quad.texCoords.forEach(c => texCoords.push(...c));
    quad.indices.forEach(idx => indices.push(idx + idxOffset));

    drawElements.push({
      idxCount: quad.indices.length,
      byteOffset: byteOffset * 2,
      transformIdx: i
    });

    idxOffset += quad.vertices.length;
    byteOffset += quad.indices.length;
  })

  return {
    drawElements,
    vertices,
    texCoords,
    indices
  }

}

export function createSpriteProgram(ctx: GLContext) {
  const { gl } = ctx;
  const vert = createShader(gl, gl.VERTEX_SHADER, vertSource);
  const frag = createShader(gl, gl.FRAGMENT_SHADER, fragSource);

  const program = createProgram(gl, vert, frag);

  const spriteProgram: ProgramInfo = {
    program: program,
    vertexArrayObj: gl.createVertexArray(),
    attributes: {
      position: {
        location: gl.getAttribLocation(program, "vertexPosition"),
        buffer: 'position',
        type: gl.FLOAT,
        numComponents: 3,
        normalise: false,
        stride: 0,
        offset: 0
      },
      texCoord: {
        location: gl.getAttribLocation(program, "texCoord"),
        buffer: "texCoord",
        type: gl.FLOAT,
        numComponents: 2,
        normalise: false,
        stride: 0,
        offset: 0
      }
    },
    uniforms: new UniformLookup(gl, program, ["projectionMatrix", "modelViewMatrix", "sampler"], [])
  }

  return spriteProgram;
}

export function createSpriteBuffers({ gl }: GLContext) {
  const buffers: Buffers = {
    position: gl.createBuffer(),
    indices: gl.createBuffer(),
    texCoord: gl.createBuffer()
  }

  return buffers;
}

export function drawSprites({ gl }: GLContext & CanvasContext, renderer: SpriteRenderer) {
  const { program: programInfo } = renderer;

  if (!renderer.isSetUp){
    gl.clearColor(0, 0, 0, 1);
    gl.clearDepth(1);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);

    renderer.isSetUp = true;
  }

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  gl.useProgram(programInfo.program);
  gl.bindVertexArray(programInfo.vertexArrayObj);

  const uniforms = programInfo.uniforms;
  gl.uniformMatrix4fv(
    uniforms.get('projectionMatrix'),
    false,
    renderer.perspectiveMatrix
  );

  gl.uniform1i(uniforms.get('sampler'), 0);

  renderer.drawElements.forEach((el) => {
    gl.uniformMatrix4fv(
      uniforms.get('modelViewMatrix'),
      false,
      mat4.mul(renderer.modelViewMatrix, renderer.viewMatrix, renderer.entityTransforms[el.transformIdx])
    );

    gl.drawElements(gl.TRIANGLES, el.idxCount, gl.UNSIGNED_SHORT, el.byteOffset);
  })
}

interface AtlasSize {
  width: number,
  height: number
}

export class SpriteManager {
  spriteSize: AtlasSize;
  sheetSize: AtlasSize;

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

  getSpriteCoord(id: number): vec2 {
    const { height: sheetHeight } = this.sheetSize;
    const { height: spriteHeight } = this.spriteSize;
    
    const rows = sheetHeight/spriteHeight;

    const row = id / rows;
    const column = id % rows;

    return [
      Math.floor(row),
      Math.floor(column)
    ];
  }
}

export interface SpriteRenderState extends RenderState {
  sprite: number,
  position: vec2
}
