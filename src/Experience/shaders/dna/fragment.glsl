uniform vec3 uColor1;
uniform vec3 uColor2;
uniform vec3 uColor3;
varying float vColorRandom;
varying vec2 vUv;

void main(){
    float alpha = 1. - smoothstep(-0.2, 0.5, length(gl_PointCoord - vec2(0.5)));
    alpha *= .3;
    vec3 color = uColor1;
    if (vColorRandom>0.33 && vColorRandom<0.66){
        color = uColor2;
    }
    if (vColorRandom>0.66){
        color = uColor3;
    }

    float gradient = smoothstep(0.30, 0.8, vUv.y);

    gl_FragColor = vec4(color, alpha * gradient);
}