#version 300 es

in vec4 aVertexPosition;

flat out int index;

uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;
void main() {
  gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
  index = gl_VertexID;
}