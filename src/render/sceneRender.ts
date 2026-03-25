import { mat4 } from "gl-matrix";
import { createShader, createProgram, ProgramInfo } from "./shaders";
import vertSource from './scene.vert';
import fragSource from './scene.frag';
import { Buffers } from "./buffers";
import { CanvasContext, GLContext, Renderer } from "./render";

export function createSceneProgram(ctx: GLContext) {
  const { gl } = ctx;
  const vert = createShader(gl, gl.VERTEX_SHADER, vertSource);
  const frag = createShader(gl, gl.FRAGMENT_SHADER, fragSource);

  const program = createProgram(gl, vert, frag);

  const sceneProgram: ProgramInfo = {
    program: program,
    attribLocations: {
      vertexPosition: gl.getAttribLocation(program, "aVertexPosition")
    },
    uniformLocations: {
      projectionMatrix: gl.getUniformLocation(program, "uProjectionMatrix")!,
      modelViewMatrix: gl.getUniformLocation(program, "uModelViewMatrix")!,
    }
  }

  return sceneProgram;

}

export function drawScene({ gl, canvas }: GLContext & CanvasContext, renderer: Renderer) {
  const { buffers, program: programInfo} = renderer;

  gl.clearColor(0, 0, 0, 1);
  gl.clearDepth(1);
  gl.enable(gl.DEPTH_TEST);
  gl.depthFunc(gl.LEQUAL);

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  setPositionAttribute(gl, buffers, programInfo);

  gl.useProgram(programInfo.program);

  gl.uniformMatrix4fv(
    programInfo.uniformLocations.projectionMatrix,
    false,
    renderer.perspectiveMatrix
  );

  gl.uniformMatrix4fv(
    programInfo.uniformLocations.modelViewMatrix,
    false,
    renderer.modelViewMatrix
  );

  gl.drawArrays(gl.TRIANGLES, 0, renderer.vertices);
}

export function setupMatrices({ canvas }: CanvasContext, renderer: Renderer) {
  mat4.identity(renderer.perspectiveMatrix);
  mat4.identity(renderer.modelViewMatrix);

  const aspect = canvas.clientWidth / canvas.clientHeight;
  mat4.perspective(renderer.perspectiveMatrix, renderer.fov, aspect, renderer.zNear, renderer.zFar);

  mat4.translate(
    renderer.modelViewMatrix,
    renderer.modelViewMatrix,
    [-0.0, 0.0, -6.0]
  );

  mat4.scale(
    renderer.modelViewMatrix,
    renderer.modelViewMatrix,
    [0.5, 0.5, 0.5]
  )
}

function setPositionAttribute(gl: WebGL2RenderingContext, buffers: Buffers, programInfo: ProgramInfo) {
  const numComponents = 3; // three floats per triangle
  const type = gl.FLOAT;
  const normalize = false;
  const stride = 0;
  const offset = 0;
  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
  gl.vertexAttribPointer(
    programInfo.attribLocations.vertexPosition,
    numComponents,
    type,
    normalize,
    stride,
    offset,
  );
  gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);
}