import * as THREE from "three";
import { WorldConfig } from "../WorldConfig";

/**
 * Classe base abstrata para luzes celestiais (sol e lua)
 */
export class CelestialLight extends THREE.DirectionalLight {
	/**
	 * @type {THREE.CameraHelper}
	 * @protected
	 */
	_helper = null;

	/**
	 * @type {WorldConfig}
	 * @protected
	 */
	_worldConfig = null;

	/**
	 * @type {number}
	 * @protected
	 */
	_orbitalTilt = 15; // Inclinação orbital em graus

	/**
	 * @param {string} name Nome da luz celestial
	 * @param {number} color Cor da luz
	 * @param {number} intensity Intensidade da luz
	 * @param {object} options Opções de configuração
	 */
	constructor(name, color, intensity, options = {}) {
		super(color, intensity);

		const {
			showHelper = false,
			worldConfig = new WorldConfig(),
			orbitalTilt = 15,
		} = options;

		this.name = name;
		this._worldConfig = worldConfig;
		this._orbitalTilt = orbitalTilt;

		// Armazena intensidade base para referência
		this.userData.baseIntensity = intensity;

		// Inicializa posição com o centro do mundo
		const worldCenter = this._worldConfig.getCenter();
		this.position.set(worldCenter.x, worldCenter.y + 8, worldCenter.z);

		// Aponta para o centro do mundo
		this.target.position.copy(worldCenter);
		this.target.updateMatrixWorld();
		this.castShadow = true;

		// Configura as sombras com base no tamanho do mundo
		this._updateShadowCamera();

		if (showHelper) {
			this._helper = new THREE.CameraHelper(this.shadow.camera);
		}
	}

	/**
	 * Retorna o helper da câmera se existir
	 * @returns {THREE.CameraHelper|null}
	 */
	getHelper() {
		return this._helper;
	}

	/**
	 * Define a inclinação orbital em graus
	 * @param {number} tilt Inclinação em graus
	 */
	setOrbitalTilt(tilt) {
		this._orbitalTilt = tilt;
	}

	/**
	 * Retorna a inclinação orbital atual em graus
	 * @returns {number} Inclinação em graus
	 */
	getOrbitalTilt() {
		return this._orbitalTilt;
	}

	/**
	 * Atualiza as configurações de sombra quando o tamanho do mundo mudar
	 */
	updateWorldSize() {
		this._updateShadowCamera();
	}

	/**
	 * Atualiza a câmera de sombra baseada no tamanho atual do mundo
	 * @protected
	 */
	_updateShadowCamera() {
		const worldDimension = this._worldConfig.getMaxDimension();

		// Define área de projeção da sombra com base no tamanho do mundo
		const shadowSize = worldDimension * 1.5;

		this.shadow.camera.left = -shadowSize / 2;
		this.shadow.camera.right = shadowSize / 2;
		this.shadow.camera.top = shadowSize / 2;
		this.shadow.camera.bottom = -shadowSize / 2;

		// Configurações básicas de sombra
		this.shadow.mapSize.width = 1024;
		this.shadow.mapSize.height = 1024;
		this.shadow.camera.near = 0.5;
		this.shadow.camera.far = worldDimension * 3;

		this.shadow.camera.updateProjectionMatrix();

		if (this._helper) {
			this._helper.update();
		}
	}

	/**
	 * Calcula a posição com base no ângulo, centro e inclinação
	 * @param {number} angle Ângulo em radianos
	 * @param {THREE.Vector3} worldCenter Centro do mundo
	 * @returns {THREE.Vector3} Nova posição
	 * @protected
	 */
	_calculatePosition(angle, worldCenter) {
		const radius = this._worldConfig.getMaxDimension() * 1.5;

		// Converte inclinação de graus para radianos
		const tiltRad = this._orbitalTilt * (Math.PI / 180);

		// Calcula posição usando trajetória celestial inclinada
		const x = worldCenter.x + Math.cos(angle) * radius;
		const y = worldCenter.y + Math.sin(angle) * radius;
		const zOffset = Math.cos(angle) * Math.tan(tiltRad) * radius;
		const z = worldCenter.z + zOffset;

		return new THREE.Vector3(x, y, z);
	}

	/**
	 * Responde a atualizações de tempo (deve ser implementado pelas subclasses)
	 * @param {object} timeInfo Informações de tempo
	 */
	onTimeUpdate(timeInfo) {
		// Método abstrato a ser implementado pelas subclasses
	}
}
