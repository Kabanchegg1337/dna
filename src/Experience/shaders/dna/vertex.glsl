attribute float aSize;
attribute float aColorRandom;

uniform float uSize;

varying float vColorRandom;
varying vec2 vUv;

void main(){

    vec4 mvPosition = modelViewMatrix * vec4(position, 1.);
    
    gl_PointSize = (20. * aSize + uSize) * (1. / - mvPosition.z);
    //gl_PointSize = (20. + uSize) * (1. / - mvPosition.z);
    
    gl_Position = projectionMatrix * mvPosition;

    vColorRandom = aColorRandom;
    vUv = uv;
}