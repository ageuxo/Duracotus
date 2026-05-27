#version 300 es

precision highp float;

in vec2 vTexCoord;

out vec4 outColour;

uniform sampler2D sampler;

void main(){
  outColour = texture(sampler, vTexCoord);
}