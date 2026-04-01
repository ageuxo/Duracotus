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
    attributes: {
      position: {
        location: gl.getAttribLocation(program, "aVertexPosition"),
        buffer: 'position',
        type: gl.FLOAT,
        numComponents: 3,
        normalise: false,
        stride: 0,
        offset: 0
      },
      colour: {
        location: gl.getAttribLocation(program, "aVertexColour"),
        buffer: 'colour',
        type: gl.FLOAT,
        numComponents: 4,
        normalise: false,
        stride: 0,
        offset: 0
      }
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

  gl.useProgram(programInfo.program);
  gl.bindVertexArray(programInfo.vertexArrayObj);

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
    offset,
  );
}