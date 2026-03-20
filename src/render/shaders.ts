
export function createShader(gl: WebGL2RenderingContext, type: GLenum, source: string) {
  const shader = gl.createShader(type);
  if (!shader) {
    throw new Error("Failed constructing shader!");
  }
  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);

  if (success) {
    return shader;
  } else {
    const error = gl.getShaderInfoLog(shader);
    gl.deleteShader(shader);
    throw new Error(`Failed compiling shader: ${error}`);
  }
}

export function createProgram(gl: WebGL2RenderingContext, vertShader: WebGLShader, fragShader: WebGLShader) {
  const program = gl.createProgram();

  gl.attachShader(program, vertShader);
  gl.attachShader(program, fragShader);

  gl.linkProgram(program);

  const success = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (success) {
    return program;
  } else {
    const error = gl.getProgramInfoLog(program);
    gl.deleteProgram(program);
    throw new Error(`Failed linking program: ${error}`);
  }

}

type AttributeLocations = {
  [key: string]: number;
};

type UniformLocations = {
  [key: string]: WebGLUniformLocation
}

export interface ProgramInfo {
  program: WebGLProgram;
  attribLocations: AttributeLocations;
  uniformLocations: UniformLocations;
};
