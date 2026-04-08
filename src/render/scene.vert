#version 300 es

const int MAX_TRANSFORMS = 100;

in vec4 vertexPosition;
in vec4 vertexColour;

out vec4 colour;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;

void main() {
  gl_Position = projectionMatrix * modelViewMatrix * vertexPosition;
  colour = vertexColour;
}