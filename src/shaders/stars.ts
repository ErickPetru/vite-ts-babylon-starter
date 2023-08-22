export const starsMapPixelShader = /*glsl*/ `
  precision highp float;

  uniform float time;

  varying vec2 vUV;

  const float PI = 3.1415926535897932384626433832795;
  const float PI2 = PI * 2.;

  float rand2D(in vec2 co) {
    return fract(sin(dot(co, vec2(12.9898, 78.233))) * 43758.5453);
  }

  float rand3D(in vec3 co) {
    return fract(sin(dot(co.xyz, vec3(12.9898, 78.233, 144.7272))) * 43758.5453);
  }

  vec3 sphericalToWorld(vec2 sphCoord, float r) {
    return vec3(r * sin(sphCoord.y) * cos(sphCoord.x), r * sin(sphCoord.y) * sin(sphCoord.x), r * cos(sphCoord.y));
  }

  float internalDotNoise3D(in float x, in float y, in float z, in float fractionalMaxDotSize, in float dDensity) {
    float integer_x = x - fract(x);
    float fractional_x = x - integer_x;
    float integer_y = y - fract(y);
    float fractional_y = y - integer_y;
    float integer_z = z - fract(z);
    float fractional_z = z - integer_z;

    if (rand3D(vec3(integer_x + 1.0, integer_y + 1.0, integer_z)) > dDensity) {
      return 0.0;
    }

    float xoffset = (rand3D(vec3(integer_x, integer_y, integer_z)) - 0.5);
    float yoffset = (rand3D(vec3(integer_x + 1.0, integer_y, integer_z)) - 0.5);
    float zoffset = (rand3D(vec3(integer_x + 2.0, integer_y, integer_z)) - 0.5);
    float dotSize = 0.5 * fractionalMaxDotSize * max(0.25, rand3D(vec3(integer_x, integer_y + 1.0, integer_z + 2.0)));

    vec3 truePos = vec3(0.5 + xoffset * (1.0 - 2.0 * dotSize), 0.5 + yoffset * (1.0 - 2.0 * dotSize), 0.5 + zoffset * (1.0 - 2.0 * dotSize));
    float distance = length(truePos - vec3(fractional_x, fractional_y, fractional_z));
    return (1.0 - smoothstep(0.35 * dotSize, 1.0 * dotSize, distance));
  }

  float dotNoise3D(in vec3 coord, in float wavelength, in float fractionalMaxDotSize, in float dDensity) {
    return internalDotNoise3D(coord.x / wavelength, coord.y / wavelength, coord.z / wavelength, fractionalMaxDotSize, dDensity);
  }

  void main(void) {
    vec2 p = vUV;
    vec3 ray = normalize(sphericalToWorld(p * vec2(PI2, PI), 1.0));

    // Background
    vec3 skyColor1 = vec3(0.01, 0.015, 0.085);
    vec3 skyColor2 = vec3(0.0025, 0.01, 0.09);
    float gFade = pow(distance(ray.z, 1.2), 2.);
    float sFade = pow(distance(ray.z, -0.5), 6.);
    float hFade = min(max(pow(distance(ray.z, -0.8), 4.), 0.), 1.0);
    vec3 color = mix(skyColor1, skyColor2, gFade);

    // Stars
    float blink1 = rand2D(vec2(time * p.x, time * p.y)) + 0.85;
    float blink2 = cos(time * 3.5 * ray.x) + 1.95;
    float blink3 = cos(sin(time * 1.25 * p.x)) + 0.05;
    float stars1 = dotNoise3D(ray, 0.01, 0.3, 0.5) * blink1;
    float stars2 = dotNoise3D(ray + 1.5, 0.01, 0.1, 0.1) * blink2;
    float stars3 = dotNoise3D(ray + ray, 0.01, 0.3, 0.1) * blink3;
    float stars4 = dotNoise3D(ray - 1.5, 0.01, 0.3, 0.1) * blink3;

    float stars = stars1 + stars2 + stars3 + stars4;
    gl_FragColor = vec4(color + stars, 1.0);
  }
`
