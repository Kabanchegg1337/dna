import * as THREE from 'three';
import Experience from "./Experience";

import vertexShader from './shaders/dna/vertex.glsl';
import fragmentShader from './shaders/dna/fragment.glsl';


export default class Dna{
    constructor(){
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.time = this.experience.time;
        this.resources = this.experience.resources;
        this.debug = this.experience.debug;
        this.config = this.experience.config
        this.parallax = {
            rotation: {
                target: {
                    x: 0,
                },
                eased: {
                    x: 0,
                    multiplier: 0.0045,
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
       
        if (this.debug){
            this.debugFolder = this.debug.addFolder({title: "Dna"})
        }

        

        this.scrollProgress = 0;

        this.setColors();

        this.setGeometry()
        this.setMaterial()
        this.setMesh()

        this.setMouse();
        this.setProgress();
    }

    

    setColors() {
        this.colors = {};
        this.colors.array = [
            "#250031",
            "#160c52",
            "#122042"
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
        this.geometry = this.resources.items.Dna.scene.children[0].geometry;
        this.geometry.center();
        const count = this.geometry.getAttribute('position').array.length / 3;

        let sizesArray = new Float32Array(count);
        let colorArray = new Float32Array(count);

        for (let i = 0; i < count; i++){
            sizesArray[i] = Math.random() + 0.25;
            colorArray[i] = Math.random();
        }
        this.geometry.setAttribute('aSize', new THREE.BufferAttribute(sizesArray, 1));
        this.geometry.setAttribute('aColorRandom', new THREE.BufferAttribute(colorArray, 1));
    }

    setMaterial(){
        this.material = new THREE.ShaderMaterial({
            vertexShader: vertexShader,
            fragmentShader: fragmentShader,
            side: THREE.DoubleSide,
            blending: THREE.AdditiveBlending,
            depthTest: false,
            depthWrite: false,
            transparent: true,
            uniforms: {
                uColor1: {value: this.colors.instances[0]},
                uColor2: {value: this.colors.instances[1]},
                uColor3: {value: this.colors.instances[2]},
                uSize: {value: 8.}
            }
        })
        if (this.debug){
            this.debugFolder.addInput(
                this.material.uniforms.uSize,
                'value',
                {min:0, max: 20, label:"pointSize"}
            )
        }

        //this.material = new THREE.PointsMaterial({color: "#ff0000", size: 0.})
    }

    setMesh(){
        this.mesh = new THREE.Points(this.geometry, this.material);
        this.mesh.scale.setScalar(0.35, 0.35, 0.35);
        this.mesh.position.x = 0.9;
        if (this.config.width < 768){
            this.mesh.position.x = 0.5;
        }
        this.mesh.position.z = -0.5;
        if (this.debug){
            this.debugFolder.addInput(
                this.mesh.rotation,
                'x',
                {min: -10, max: 10, step: 0.001, label: "rotationx"}
            )
            this.debugFolder.addInput(
                this.mesh.rotation,
                'y',
                {min: -10, max: 10, step: 0.001, label: "rotationy"}
            )
            this.debugFolder.addInput(
                this.mesh.rotation,
                'z',
                {min: -10, max: 10, step: 0.001, label: "rotationz"}
            )

            this.debugFolder.addInput(
                this.mesh.position,
                'y',
                {min: -10, max: 10, step: 0.001, label: "positionX"}
            )

            this.debugFolder.addInput(
                this.mesh.scale,
                'x',
                {min: -10, max: 10, step: 0.001, label: "scaley"}
            )
           
        }
        this.scene.add(this.mesh);
    }

    setMouse(){
        document.addEventListener('mousemove', (e) => {
            const rotationCoef = (e.clientY / this.config.height) - 0.5;
            this.parallax.rotation.target.x = rotationCoef * 0.075;
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
        this.lastElapsedTime = this.time.elapsed;

        this.parallax.rotation.eased.x += (this.parallax.rotation.target.x - this.parallax.rotation.eased.x) * deltaTime * this.parallax.rotation.eased.multiplier;
        this.mesh.rotation.x = this.parallax.rotation.eased.x;

        this.scroll.eased.progress += (this.scroll.target.progress - this.scroll.eased.progress) * deltaTime * this.scroll.eased.multiplier;
        this.mesh.position.y = -1 + this.scroll.eased.progress;


        this.mesh.rotation.y = - this.time.elapsed * 0.00003 - this.scroll.eased.progress * 3;
    }
}