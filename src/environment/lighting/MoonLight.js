import { CelestialLight } from "./CelestialLight";

/**
 * Classe responsável por gerenciar a luz direcional da lua
 */
export class MoonLight extends CelestialLight {
	/**
	 * @param {object} options Opções de configuração
	 */
	constructor(options = {}) {
		const { color = 0x4444aa, intensity = 0.3, ...otherOptions } = options;

		super("Moon", color, intensity, otherOptions);
	}

	/**
	 * Posiciona a lua em oposição ao sol (180 graus)
	 * @param {THREE.Vector3} sunPosition Posição do sol
	 * @param {THREE.Vector3} worldCenter Centro do mundo
	 */
	positionOppositeSun(sunPosition, worldCenter) {
		const timeManager = this._worldConfig.timeManager;
		if (!timeManager) return;

		// Obtém o tempo atual e adiciona meio ciclo para ficar oposto ao sol
		const dayTime = (timeManager.dayTime + 0.5) % 1.0;
		const angle = dayTime * Math.PI * 2;

		// Utiliza o método da classe base para calcular a nova posição
		const newPosition = this._calculatePosition(angle, worldCenter);
		this.position.copy(newPosition);

		// Aponta para o centro do mundo
		this.target.position.copy(worldCenter);
		this.target.updateMatrixWorld();
	}

	/**
	 * Atualiza o estado da luz com base no tempo
	 * @param {object} timeInfo Informações de tempo
	 */
	onTimeUpdate(timeInfo) {
		// A atualização é feita pelo LightingManager através do método positionOppositeSun
	}
}
