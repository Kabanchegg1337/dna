import * as THREE from 'three';
import Experience from './Experience.js';

import vertexShader from './shaders/particles/vertex.glsl';
import fragmentShader from './shaders/particles/fragment.glsl';

export default class Particles {
    constructor(){
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.time = this.experience.time;
        this.resources = this.experience.resources;
        this.debug = this.experience.debug;
        this.config = this.experience.config

        this.count = 500;
        if (this.debug){
            this.debugFolder = this.debug.addFolder({title: "particles"})
        }

        this.parallax = {
            rotation: {
                target: {
                    x: 0,
                },
                eased: {
                    x: 0,
                    multiplier: 0.0025,
                }
            }
        };
        this.scroll = {
            target: {
                progress: 0,
            },
            eased: {
                progress: 0,
                multiplier: 0.01,
            }
        }
        this.lastElapsedTime = 0;

        this.setColors();
        this.setGeometry();
        this.setMaterial();
        this.setMesh();
        this.setMouse();
        this.setProgress();
    }

    setColors() {
        this.colors = {};
        this.colors.array = [
            "#8e0ab8",
            "#2b40c8",
            "#8a8b8f"
        ];
        this.colors.instances = [
            new THREE.Color(this.colors.array[0]),
            new THREE.Color(this.colors.array[1]),
            new THREE.Color(this.colors.array[2])
        ]

        if (this.debug){
            this.debugFolder.addInput(
                this.colors.array,
                [0],
                {view: 'color', label:"color1"}
            )
            .on('change', () => {
                this.colors.instances[0].set(this.colors.array[0]);
            })


            this.debugFolder.addInput(
                this.colors.array,
                [1],
                {view: 'color', label:"color2"}
            )
            .on('change', () => {
                this.colors.instances[1].set(this.colors.array[1]);
            })


            this.debugFolder.addInput(
                this.colors.array,
                [2],
                {view: 'color', label:"color3"}
            )
            .on('change', () => {
                this.colors.instances[2].set(this.colors.array[2]);
            })
        }
    }

    setGeometry(){
        this.geometry = new THREE.BufferGeometry();

        const positionArray = new Float32Array(this.count * 3)
        const progressArray = new Float32Array(this.count);
        const sizeArray = new Float32Array(this.count);
        const alphaArray = new Float32Array(this.count);

        for(let i = 0; i < this.count; i++){
            positionArray[i * 3 + 0] = Math.random() - 0.5;
            positionArray[i * 3 + 1] = Math.random() - 0.5;
            positionArray[i * 3 + 2] = Math.random() - 0.5;

            progressArray[i] = Math.random();
            sizeArray[i] = Math.random();
            alphaArray[i] = Math.random();
        }

        this.geometry.setAttribute('position', new THREE.Float32BufferAttribute(positionArray, 3));
        this.geometry.setAttribute('aProgress', new THREE.Float32BufferAttribute(progressArray, 1));
        this.geometry.setAttribute('aSize', new THREE.Float32BufferAttribute(sizeArray, 1));
        this.geometry.setAttribute('aColorRandom', new THREE.Float32BufferAttribute(alphaArray, 1));
    }

    setMaterial(){
        this.material = new THREE.ShaderMaterial({
            vertexShader: vertexShader,
            fragmentShader: fragmentShader,
            transparent: true,
            depthTest: false,
            depthWrite: false,
            blending: THREE.AdditiveBlending,
            uniforms: {
                uTime: {value: 0.},
                uSize: {value: 10.},
                uColor1: {value: this.colors.instances[0]},
                uColor2: {value: this.colors.instances[1]},
                uColor3: {value: this.colors.instances[2]},
            }
        })

        if (this.debug){
            this.debugFolder.addInput(
                this.material.uniforms.uSize,
                'value',
                {min:0, max: 100, step: 0.01, title: "size"}
            )
        }
    }

    setMesh(){
        this.mesh = new THREE.Points(this.geometry, this.material);
        this.mesh.scale.set(3, 10, 3)
        this.mesh.position.y = -1.;
        this.mesh.position.x = 1.1;
        this.scene.add(this.mesh);
    }

    setMouse(){
        document.addEventListener('mousemove', (e) => {
            const rotationCoef = (e.clientY / this.config.height) - 0.5;
            this.parallax.rotation.target.x = rotationCoef * 0.05;
        })
    }

    setProgress(){
        document.addEventListener('scroll', (e) => {
            const el = document.querySelector('html');
            this.scroll.target.progress = el.scrollTop / el.scrollHeight;
        })
    }

    update(){

        const deltaTime = this.time.elapsed - this.lastElapsedTime;        

        this.mesh.material.uniforms.uTime.value = this.time.elapsed;

        this.scroll.eased.progress += (this.scroll.target.progress - this.scroll.eased.progress) * deltaTime  * this.scroll.eased.multiplier;

        this.mesh.rotation.y = - this.time.elapsed * 0.00003 - this.scroll.eased.progress * 3;


        this.lastElapsedTime = this.time.elapsed;
        this.parallax.rotation.eased.x += (this.parallax.rotation.target.x - this.parallax.rotation.eased.x) * deltaTime * this.parallax.rotation.eased.multiplier
        this.mesh.rotation.x = this.parallax.rotation.eased.x;
    }
}