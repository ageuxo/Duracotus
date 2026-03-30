#version 300 es

precision highp float;

in vec4 colour;

out vec4 outColour;

// simple integer hash -> float in [0,1)
float hashFloat(int x) {
    uint u = uint(x);
    u = (u ^ 61u) ^ (u >> 16);
    u *= 9u;
    u = u ^ (u >> 4);
    u *= 0x27d4eb2du;
    u = u ^ (u >> 15);
    return float(u) / 4294967295.0;
}

vec3 colorFromIndex(int idx) {
    float r = hashFloat(idx * 374761393); // different multipliers to decorrelate
    float g = hashFloat(idx * 668265263 + 1);
    float b = hashFloat(idx * 15485863 + 2);
    // Optional boost/contrast
    vec3 c = vec3(r, g, b) * 0.85 + 0.15;
    return c;
}

void main(){  
  outColour = colour;
}