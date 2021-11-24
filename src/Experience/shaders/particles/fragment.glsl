uniform vec3 uColor1;
uniform vec3 uColor2;
uniform vec3 uColor3;

varying float vColorRandom;

void main(){

    vec3 color = uColor1;
    if (vColorRandom>0.33 && vColorRandom<0.66){
        color = uColor2;
    }
    if (vColorRandom>0.66){
        color = uColor3;
    }
    
    float alpha = 1. - smoothstep(-0.2, 0.5, length(gl_PointCoord - 0.5));
    //alpha *= 0.5;
    alpha += 1.;

    gl_FragColor = vec4(color, alpha);
}