import Renderer from "./Renderer";
import Texture2D from "./Texture2D";
import GLConstants from "./GLConstants";
import Framebuffer from "./Framebuffer";

interface GBufferTexture {
	name: string;
	format: number;
	internalFormat: number;
	type: number;
	mipmaps: boolean;
}

export default class GBuffer {
	private readonly renderer: Renderer;
	private readonly structure: GBufferTexture[];
	public textures: { [key: string]: Texture2D } = {};
	public framebuffer: Framebuffer;
	public framebufferHDR: Framebuffer;
	public width: number;
	public height: number;

	public constructor(renderer: Renderer, width: number, height: number, structure: GBufferTexture[]) {
		this.renderer = renderer;
		this.structure = structure;
		this.width = width;
		this.height = height;

		this.initTextures();
		this.initFramebuffers();
	}

	private initTextures(): void {
		for (let i = 0; i < this.structure.length; i++) {
			const element = this.structure[i];

			this.textures[element.name] = new Texture2D(this.renderer, {
				width: this.width,
				height: this.height,
				minFilter: element.mipmaps ? GLConstants.NEAREST_MIPMAP_NEAREST : GLConstants.NEAREST,
				magFilter: GLConstants.NEAREST,
				wrap: GLConstants.CLAMP_TO_EDGE,
				format: element.format,
				internalFormat: element.internalFormat,
				type: element.type
			});
		}
	}

	private initFramebuffers(): void {
		const texturesArray: Texture2D[] = [];

		for(const texture of Object.values(this.textures)) {
			texturesArray.push(texture);
		}

		this.framebuffer = new Framebuffer(this.renderer, {
			width: this.width,
			height: this.height,
			textures: texturesArray,
			usesDepth: true
		});

		this.textures.depth = <Texture2D>this.framebuffer.depthTexture;

		this.framebufferHDR = new Framebuffer(this.renderer, {
			width: this.width,
			height: this.height,
			textures: [
				new Texture2D(this.renderer, {
					width: this.width,
					height: this.height,
					minFilter: GLConstants.LINEAR,
					magFilter: GLConstants.LINEAR,
					wrap: GLConstants.CLAMP_TO_EDGE,
					format: GLConstants.RGBA,
					internalFormat: GLConstants.RGBA16F,
					type: GLConstants.HALF_FLOAT
				})
			]
		});
	}

	public clearDepth(): void {
		this.renderer.gl.clearBufferfi(GLConstants.DEPTH_STENCIL, 0, 1, 0);
	}

	public setSize(width: number, height: number): void {
		this.width = width;
		this.height = height;
		this.framebuffer.setSize(width, height);
		this.framebufferHDR.setSize(width, height);
	}
}