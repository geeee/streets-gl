import Material, {UniformType} from "../../../renderer/Material";
import Renderer from "../../../renderer/Renderer";
import Shaders from "../shaders/Shaders";
import GBuffer from "../../../renderer/GBuffer";

export default class LDRComposeMaterial extends Material {
	constructor(renderer: Renderer, gBuffer: GBuffer) {
		super(renderer, {
			name: 'LDRComposeMaterial',
			fragmentShader: Shaders.ldrCompose.fragment,
			vertexShader: Shaders.ldrCompose.vertex,
			uniforms: {
				tHDR: {
					type: UniformType.Texture2D,
					value: gBuffer.framebufferHDR.textures[0]
				},
				tDoF: {
					type: UniformType.Texture2D,
					value: null
				},
				tCoC: {
					type: UniformType.Texture2D,
					value: null
				}
			}
		});
	}
}
