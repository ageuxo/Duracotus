import { mat4 } from "gl-matrix";
import { createShader, createProgram, ProgramInfo, UniformLookup } from "./shaders";
import vertSource from './scene.vert';
import fragSource from './scene.frag';
import { CanvasContext, GLContext, Renderer } from "./render";
import { Buffers, uploadFloatBuffer } from "./buffers";
import { SimpleScene } from "../physics/scene";

export class SceneRenderer extends Renderer {
  constructor(ctx: GLContext) {
    super(createSceneProgram(ctx), createSceneBuffers(ctx));
  }

  render(ctx: GLContext & CanvasContext): void {
    drawScene(ctx, this);
  }

  public uploadData(ctx: GLContext, scene: SimpleScene): void {
    const { drawElements, vertices, indices, colours } = scene.extractRenderData();
    const { gl } = ctx;
    this.drawElements = drawElements;
    
    // Upload indices
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.buffers.indices);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

    uploadFloatBuffer(gl, this.buffers.position, vertices);
    uploadFloatBuffer(gl, this.buffers.colour, colours);
  }
}

export function createSceneProgram(ctx: GLContext) {
  const { gl } = ctx;
  const vert = createShader(gl, gl.VERTEX_SHADER, vertSource);
  const frag = createShader(gl, gl.FRAGMENT_SHADER, fragSource);

  const program = createProgram(gl, vert, frag);

  const sceneProgram: ProgramInfo = {
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
      colour: {
        location: gl.getAttribLocation(program, "vertexColour"),
        buffer: 'colour',
        type: gl.FLOAT,
        numComponents: 4,
        normalise: false,
        stride: 0,
        offset: 0
      }
    },
    uniforms: new UniformLookup(gl, program, ["projectionMatrix", "modelViewMatrix"], []),
  }

  return sceneProgram;

}

function createSceneBuffers({ gl }: GLContext) {
  const buffers: Buffers = {
    position: gl.createBuffer(),
    indices: gl.createBuffer(),
    colour: gl.createBuffer()
  }

  return buffers;
}

function drawScene(ctx: GLContext & CanvasContext, renderer: Renderer) {
  const { gl } = ctx;
  const { program: programInfo } = renderer;

  gl.clearColor(0, 0, 0, 1);
  gl.clearDepth(1);
  gl.enable(gl.DEPTH_TEST);
  gl.depthFunc(gl.LEQUAL);

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  gl.useProgram(programInfo.program);
  gl.bindVertexArray(programInfo.vertexArrayObj);

  const uniforms = programInfo.uniforms;
  gl.uniformMatrix4fv(
    uniforms.get('projectionMatrix'),
    false,
    renderer.perspectiveMatrix
  );

  renderer.drawElements.forEach((el) => {
    gl.uniformMatrix4fv(
      uniforms.get('modelViewMatrix'),
      false,
      mat4.mul(renderer.modelViewMatrix, renderer.viewMatrix, renderer.entityTransforms[el.transformIdx])
    );

    gl.drawElements(gl.TRIANGLES, el.idxCount, gl.UNSIGNED_SHORT, el.byteOffset);
  })
}

function uploadEntityTransforms(gl: WebGL2RenderingContext, renderer: Renderer) {
  const count = Math.min(renderer.entityTransforms.length, 100); // MAX_TRANSFORMS as in scene.vert
  for (let i = 0; i < count; i++) {
    gl.uniformMatrix4fv(renderer.program.uniforms.get("transforms", i), false, new Float32Array(renderer.entityTransforms[i]));
  }
}