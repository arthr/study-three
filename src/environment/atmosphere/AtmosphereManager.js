import * as THREE from "three";

export class AtmosphereManager {
	/**
	 * @param {THREE.Scene} scene A cena para aplicar efeitos de atmosfera
	 */
	constructor(scene) {
		this.scene = scene;
		this.fog = null;
		this.skybox = null;
	}

	/**
	 * Configura a névoa na cena
	 * @param {object} options Opções para configuração da névoa
	 */
	setFog(options = {}) {
		const {
			color = 0xcccccc,
			near = 1,
			far = 50,
			density = 0.02,
			type = "linear", // 'linear' ou 'exp'
		} = options;

		// Remove névoa existente
		this.scene.fog = null;

		if (type === "exp") {
			this.fog = new THREE.FogExp2(color, density);
		} else {
			this.fog = new THREE.Fog(color, near, far);
		}

		this.scene.fog = this.fog;
		return this.fog;
	}

	/**
	 * Configura um skybox na cena
	 * @param {string|string[]} texturePath Caminho para a textura ou array de caminhos
	 */
	setSkybox(texturePath, options = {}) {
		const { size = 500 } = options;

		// Remove skybox existente se houver
		if (this.skybox) {
			this.scene.remove(this.skybox);
			this.skybox.geometry.dispose();
			this.skybox.material.dispose();
		}

		let material;

		if (Array.isArray(texturePath) && texturePath.length === 6) {
			// CubeMap com 6 texturas
			const loader = new THREE.CubeTextureLoader();
			const textureCube = loader.load(texturePath);
			material = new THREE.MeshBasicMaterial({
				envMap: textureCube,
				side: THREE.BackSide,
			});
		} else {
			// Textura única
			const loader = new THREE.TextureLoader();
			const texture = loader.load(texturePath);
			material = new THREE.MeshBasicMaterial({
				map: texture,
				side: THREE.BackSide,
			});
		}

		const geometry = new THREE.BoxGeometry(size, size, size);
		this.skybox = new THREE.Mesh(geometry, material);

		this.scene.add(this.skybox);
		return this.skybox;
	}

	/**
	 * Atualiza elementos da atmosfera
	 */
	update(deltaTime) {
		// Pode ser usado para animar elementos atmosféricos
	}

	/**
	 * Responde a mudanças no tempo
	 */
	onTimeUpdate(timeInfo) {
		// Ajusta a atmosfera com base no ciclo dia/noite
		if (this.fog) {
			// Exemplo: névoa mais densa à noite
			const dayFactor = Math.sin(timeInfo.dayTime * Math.PI);

			if (this.fog instanceof THREE.FogExp2) {
				this.fog.density = 0.01 + (1 - dayFactor) * 0.03;
			} else {
				this.fog.far = 30 + dayFactor * 20;
			}
		}
	}
}
