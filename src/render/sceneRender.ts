import { mat4 } from "gl-matrix";
import { createShader, createProgram, ProgramInfo } from "./shaders";
import vertSource from './scene.vert';
import fragSource from './scene.frag';
import { Buffers } from "./buffers";
import { CanvasContext, GLContext } from "./render";

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

export function drawScene({ gl, canvas }: GLContext & CanvasContext, programInfo: ProgramInfo, buffers: Buffers) {
  gl.clearColor(0, 0, 0, 1);
  gl.clearDepth(1);
  gl.enable(gl.DEPTH_TEST);
  gl.depthFunc(gl.LEQUAL);

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  const fov = (45 * Math.PI) / 180;
  const aspect = canvas.clientWidth / canvas.clientHeight;
  const zNear = 0.1;
  const zFar = 100.0;
  const projectionMatrix = mat4.create();

  mat4.perspective(projectionMatrix, fov, aspect, zNear, zFar);

  const modelViewMatrix = mat4.create();

  mat4.translate(
    modelViewMatrix,
    modelViewMatrix,
    [-0.0, 0.0, -6.0]
  );

  setPositionAttribute(gl, buffers, programInfo);

  gl.useProgram(programInfo.program);

  gl.uniformMatrix4fv(
    programInfo.uniformLocations.projectionMatrix,
    false,
    projectionMatrix
  );

  gl.uniformMatrix4fv(
    programInfo.uniformLocations.modelViewMatrix,
    false,
    modelViewMatrix
  );

  gl.drawArrays(gl.TRIANGLES, 0, 4);
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