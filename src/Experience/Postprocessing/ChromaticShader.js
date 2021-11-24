import vertexShader from '../shaders/postprocessing/chromatic/vertex.glsl';
import fragmentShader from '../shaders/postprocessing/chromatic/fragment.glsl';

/**
 * Full-screen textured quad shader
 */

const ChromaticShader = {

	uniforms: {

		'tDiffuse': { value: null },
        'uMaxDistort': {value: 2.2},

	},

	vertexShader: vertexShader,
	fragmentShader: fragmentShader,

};

export default ChromaticShader;