import * as THREE from "three";

export class FogEffect {
	/**
	 * @param {THREE.Scene} scene A cena para aplicar o efeito de névoa
	 * @param {object} options Opções para a névoa
	 */
	constructor(scene, options = {}) {
		this.scene = scene;
		this.active = false;
		this.originalFog = scene.fog ? scene.fog.clone() : null;

		const {
			color = 0xddeeff,
			density = 0.03,
			transitionTime = 2.0, // segundos para transição
			type = "exp", // 'linear' ou 'exp'
		} = options;

		this.options = { color, density, transitionTime, type };
		this.transitionProgress = 0;
		this.targetFog = null;
	}

	/**
	 * Cria o efeito de névoa
	 */
	createFogEffect() {
		const { color, density, type } = this.options;

		if (type === "exp") {
			this.targetFog = new THREE.FogExp2(color, density);
		} else {
			this.targetFog = new THREE.Fog(color, 1, 1 / density);
		}
	}

	/**
	 * Inicia o efeito de névoa
	 */
	start() {
		if (!this.active) {
			this.active = true;

			// Guarda a névoa original (se existir)
			if (this.scene.fog) {
				this.originalFog = this.scene.fog.clone();
			}

			this.createFogEffect();
			this.transitionProgress = 0;
		}
	}

	/**
	 * Para o efeito de névoa
	 */
	stop() {
		if (this.active) {
			this.active = false;
			this.transitionProgress = 0;

			// Restaura a névoa original
			this.scene.fog = this.originalFog;
		}
	}

	/**
	 * Atualiza a transição da névoa
	 * @param {number} deltaTime Tempo desde o último frame
	 */
	update(deltaTime) {
		if (!this.active || !this.targetFog) return;

		// Atualiza a transição
		if (this.transitionProgress < 1) {
			this.transitionProgress += deltaTime / this.options.transitionTime;
			this.transitionProgress = Math.min(1, this.transitionProgress);

			// Se não há névoa original, aplica diretamente
			if (!this.originalFog) {
				this.scene.fog = this.targetFog;
				return;
			}

			// Cria névoa intermediária para transição suave
			if (
				this.originalFog instanceof THREE.FogExp2 &&
				this.targetFog instanceof THREE.FogExp2
			) {
				// Transição para FogExp2
				if (
					!this.scene.fog ||
					!(this.scene.fog instanceof THREE.FogExp2)
				) {
					this.scene.fog = new THREE.FogExp2(
						this.originalFog.color.clone(),
						this.originalFog.density
					);
				}

				// Interpola cor e densidade
				this.scene.fog.color.lerpColors(
					this.originalFog.color,
					this.targetFog.color,
					this.transitionProgress
				);

				this.scene.fog.density =
					this.originalFog.density +
					(this.targetFog.density - this.originalFog.density) *
						this.transitionProgress;
			} else if (
				this.originalFog instanceof THREE.Fog &&
				this.targetFog instanceof THREE.Fog
			) {
				// Transição para Fog
				if (!this.scene.fog || !(this.scene.fog instanceof THREE.Fog)) {
					this.scene.fog = new THREE.Fog(
						this.originalFog.color.clone(),
						this.originalFog.near,
						this.originalFog.far
					);
				}

				// Interpola cor, near e far
				this.scene.fog.color.lerpColors(
					this.originalFog.color,
					this.targetFog.color,
					this.transitionProgress
				);

				this.scene.fog.near =
					this.originalFog.near +
					(this.targetFog.near - this.originalFog.near) *
						this.transitionProgress;

				this.scene.fog.far =
					this.originalFog.far +
					(this.targetFog.far - this.originalFog.far) *
						this.transitionProgress;
			}
		}
	}
}
