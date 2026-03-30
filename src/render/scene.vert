#version 300 es

in vec4 aVertexPosition;
in vec4 aVertexColour;

out vec4 colour;

uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;
void main() {
  gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
  colour = aVertexColour;
}