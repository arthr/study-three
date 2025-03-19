import * as THREE from "three";

export class FireLight extends THREE.PointLight {
	/**
	 * @type {number}
	 * @private
	 */
	_time = 0;

	/**
	 * @type {boolean}
	 * @private
	 */
	_animate = true;

	/**
	 * @type {THREE.PointLightHelper}
	 * @private
	 */
	_helper = null;

	/**
	 * @param {object} options Opções de configuração
	 */
	constructor(options = {}) {
		const {
			color = 0xff7700,
			intensity = 1.5,
			distance = 5,
			decay = 2,
			showHelper = false,
			flickerSpeed = 1,
			flickerIntensity = 0.3,
		} = options;

		super(color, intensity, distance, decay);

		this.name = "Fire";
		this.castShadow = true;

		this._flickerSpeed = flickerSpeed;
		this._flickerIntensity = flickerIntensity;
		this._baseIntensity = intensity;

		if (showHelper) {
			this._helper = new THREE.PointLightHelper(this, 0.5);
		}
	}

	/**
	 * @returns {THREE.PointLightHelper|null}
	 */
	getHelper() {
		return this._helper;
	}

	/**
	 * Atualiza a animação da luz de fogo
	 * @param {number} deltaTime Tempo desde o último quadro em segundos
	 */
	update(deltaTime) {
		if (!this._animate) return;

		this._time += deltaTime * this._flickerSpeed;

		// Animação de tremulação (flicker) usando Perlin noise simplificado
		const noise1 = Math.sin(this._time * 10) * 0.5 + 0.5;
		const noise2 = Math.sin(this._time * 15.3) * 0.5 + 0.5;
		const noise3 = Math.sin(this._time * 5.7) * 0.5 + 0.5;

		const flickerValue = noise1 * noise2 * noise3 * this._flickerIntensity;

		// Aplica a tremulação à intensidade
		this.intensity =
			this._baseIntensity * (1 - this._flickerIntensity / 2) +
			flickerValue;

		// Atualiza o helper se existir
		if (this._helper) {
			this._helper.update();
		}
	}

	/**
	 * Ativa/desativa a animação
	 * @param {boolean} value
	 */
	setAnimate(value) {
		this._animate = value;
	}
}
