import * as THREE from 'three'
import Experience from './Experience.js'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import ChromaticShader from './Postprocessing/ChromaticShader.js'

export default class Renderer
{
    constructor(_options = {})
    {
        this.experience = new Experience()
        this.config = this.experience.config
        this.debug = this.experience.debug
        this.stats = this.experience.stats
        this.time = this.experience.time
        this.sizes = this.experience.sizes
        this.scene = this.experience.scene
        this.camera = this.experience.camera
        
        this.usePostprocess = true

        this.setInstance()
        this.setPostProcess()
    }

    setInstance()
    {
        this.clearColor = '#555555'

        // Renderer
        this.instance = new THREE.WebGLRenderer({
            alpha: false,
            antialias: true
        })
        this.instance.domElement.style.position = 'absolute'
        this.instance.domElement.style.top = 0
        this.instance.domElement.style.left = 0
        this.instance.domElement.style.width = '100%'
        this.instance.domElement.style.height = '100%'

        // this.instance.setClearColor(0x414141, 1)
        this.instance.setClearColor(this.clearColor, 1)
        this.instance.setSize(this.config.width, this.config.height)
        this.instance.setPixelRatio(this.config.pixelRatio)

        // this.instance.physicallyCorrectLights = true
        // this.instance.gammaOutPut = true
        // this.instance.outputEncoding = THREE.sRGBEncoding
        // this.instance.shadowMap.type = THREE.PCFSoftShadowMap
        // this.instance.shadowMap.enabled = false
        // this.instance.toneMapping = THREE.ReinhardToneMapping
        // this.instance.toneMapping = THREE.ReinhardToneMapping
        // this.instance.toneMappingExposure = 1.3

        this.context = this.instance.getContext()

        // Add stats panel
        if(this.stats)
        {
            this.stats.setRenderPanel(this.context)
        }
    }

    setPostProcess()
    {
        if (this.debug){
            this.postProcessFolder = this.debug.addFolder({title: "Postprocessing"});
        }

        this.postProcess = {}


        /**
         * Chromatic abberation shader
         */
        this.postProcess.chromaticPass = new ShaderPass( ChromaticShader );
        this.postProcess.chromaticPass.uniforms.uMaxDistort.value = 0.09;

        if (this.debug){
            this.chromaticFolder = this.postProcessFolder.addFolder({title: "Chromatic"})
            this.chromaticFolder.addInput(
                this.postProcess.chromaticPass.uniforms.uMaxDistort,
                'value',
                {min: 0, max: 2, step: 0.01, label: "MaxDistortion"}
            )
            
        }

        /**
         * Unreal bloom pass
         */
        this.postProcess.bloomPass = new UnrealBloomPass(new THREE.Vector2(this.config.width, this.config.height), 0.75, 0.65, 0.39)
        

        if (this.debug){
            this.bloomFolder = this.postProcessFolder.addFolder({title: "Bloom", expanded: false})
            this.bloomFolder.addInput(
                this.postProcess.bloomPass,
                'strength',
                {min: 0, max: 4, step: 0.01}
            )
            this.bloomFolder.addInput(
                this.postProcess.bloomPass,
                'radius',
                {min: 0, max: 10, step: 0.01}
            )
            this.bloomFolder.addInput(
                this.postProcess.bloomPass,
                'threshold',
                {min: -1.5, max: 1.5, step: 0.01}
            )
            
            
        }



        /**
         * Render pass
         */
        this.postProcess.renderPass = new RenderPass(this.scene, this.camera.instance)

        /**
         * Effect composer
         */
        //const RenderTargetClass = this.config.pixelRatio >= 2 ? THREE.WebGLRenderTarget : THREE.WebGLMultisampleRenderTarget
        const RenderTargetClass = THREE.WebGLRenderTarget
        this.renderTarget = new RenderTargetClass(
            this.config.width,
            this.config.height,
            {
                generateMipmaps: false,
                minFilter: THREE.LinearFilter,
                magFilter: THREE.LinearFilter,
                format: THREE.RGBFormat,
                encoding: THREE.sRGBEncoding
            }
        )
        this.postProcess.composer = new EffectComposer(this.instance, this.renderTarget)
        this.postProcess.composer.setSize(this.config.width, this.config.height)
        this.postProcess.composer.setPixelRatio(this.config.pixelRatio)

        this.postProcess.composer.addPass(this.postProcess.renderPass)
        this.postProcess.composer.addPass(this.postProcess.chromaticPass)
        this.postProcess.composer.addPass(this.postProcess.bloomPass)
    }

    resize()
    {
        // Instance
        this.instance.setSize(this.config.width, this.config.height)
        this.instance.setPixelRatio(this.config.pixelRatio)

        // Post process
        this.postProcess.composer.setSize(this.config.width, this.config.height)
        this.postProcess.composer.setPixelRatio(this.config.pixelRatio)
    }

    update()
    {
        if(this.stats)
        {
            this.stats.beforeRender()
        }

        if(this.usePostprocess)
        {
            this.postProcess.composer.render()
        }
        else
        {
            this.instance.render(this.scene, this.camera.instance)
        }

        if(this.stats)
        {
            this.stats.afterRender()
        }
    }

    destroy()
    {
        this.instance.renderLists.dispose()
        this.instance.dispose()
        this.renderTarget.dispose()
        this.postProcess.composer.renderTarget1.dispose()
        this.postProcess.composer.renderTarget2.dispose()
    }
}