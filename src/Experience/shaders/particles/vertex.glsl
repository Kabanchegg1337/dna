attribute float aSize;
attribute float aColorRandom;

uniform float uSize;
uniform float uTime;

varying float vColorRandom;

void main(){

    vColorRandom = aColorRandom;

    vec3 newpos = position;
    newpos.y = mod(newpos.y - uTime * 0.000002, 1.);

    vec4 modelPosition = modelMatrix * vec4(newpos, 1.);
    
    vec4 viewPosition = viewMatrix * modelPosition;
    gl_Position = projectionMatrix * viewPosition;
    gl_PointSize = uSize * aSize;
    gl_PointSize *= (1.0 / - viewPosition.z);
}