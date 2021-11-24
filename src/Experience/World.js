import * as THREE from 'three'
import Dna from './Dna.js'
import Particles from './Particles.js'
import Experience from './Experience.js'

export default class World
{
    constructor(_options)
    {
        this.experience = new Experience()
        this.config = this.experience.config
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        
        this.resources.on('groupEnd', (_group) =>
        {
            if(_group.name === 'base')
            {
                //this.setDummy()
                this.setDna();
                this.setParticles()
            }
        })
    }

    setDna(){
        this.dna = new Dna();
    }

    setParticles(){
        this.particles = new Particles();
    }

    setDummy()
    {
        const cube = new THREE.Mesh(
            new THREE.BoxGeometry(1, 1, 1),
            new THREE.MeshBasicMaterial({ map: this.resources.items.lennaTexture })
        )
        this.scene.add(cube)        
    }

    resize()
    {
    }

    update()
    {
        if (this.dna){
            this.dna.update();
        }
        if (this.particles){
            this.particles.update();
        }
    }

    destroy()
    {
    }
}