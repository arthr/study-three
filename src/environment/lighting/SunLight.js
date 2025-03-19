import { CelestialLight } from "./CelestialLight";

/**
 * Classe responsável por gerenciar a luz direcional do sol
 */
export class SunLight extends CelestialLight {
	/**
	 * @type {number}
	 * @private
	 */
	_time = 0;

	/**
	 * @type {number}
	 * @private
	 */
	_dayDuration = 60; // segundos para um ciclo completo

	/**
	 * @type {boolean}
	 * @private
	 */
	_animate = false;

	/**
	 * @param {object} options Opções de configuração
	 */
	constructor(options = {}) {
		const {
			color = 0xffffff,
			intensity = 2,
			dayDuration = 60,
			...otherOptions
		} = options;

		super("Sun", color, intensity, otherOptions);

		this._dayDuration = dayDuration;
	}

	/**
	 * Define o tempo diretamente (0-1 representando um ciclo completo)
	 * @param {number} time Valor de 0 a 1
	 */
	setTime(time) {
		this._time = time * this._dayDuration;
		this._updatePosition();
	}

	/**
	 * Implementa onTimeUpdate para compatibilidade com o sistema de tempo
	 * @param {object} timeInfo Informações de tempo
	 */
	onTimeUpdate(timeInfo) {
		this.setTime(timeInfo.dayTime);
	}

	/**
	 * Atualiza a posição do sol com base no tempo
	 * @param {number} deltaTime Tempo desde o último quadro em segundos
	 */
	update(deltaTime) {
		if (!this._animate) return;

		this._time += deltaTime;

		// Reinicia quando um ciclo completo é concluído
		if (this._time > this._dayDuration) {
			this._time = 0;
		}

		this._updatePosition();
	}

	/**
	 * Atualiza a posição do sol com base no tempo atual
	 * @private
	 */
	_updatePosition() {
		// Calcula o ângulo com base no tempo (0 a 2π)
		const angle = (this._time / this._dayDuration) * Math.PI * 2;

		// Obtém o centro do mundo
		const worldCenter = this._worldConfig.getCenter();

		// Utiliza o método da classe base para calcular a nova posição
		const newPosition = this._calculatePosition(angle, worldCenter);
		this.position.copy(newPosition);

		// Aponta para o centro do mundo
		this.target.position.copy(worldCenter);
		this.target.updateMatrixWorld();

		// Ajusta intensidade com base na altura (luz diurna)
		const normalizedHeight = Math.max(0, Math.sin(angle));
		this.intensity = normalizedHeight * this.userData.baseIntensity;

		// Atualiza matrizes
		this.updateMatrixWorld(true);
		if (this._helper) {
			this._helper.update();
		}
	}

	/**
	 * Inicia a animação do sol
	 */
	startAnimation() {
		this._animate = true;
	}

	/**
	 * Para a animação do sol
	 */
	stopAnimation() {
		this._animate = false;
	}

	/**
	 * Define a duração do ciclo dia/noite
	 * @param {number} duration Duração em segundos
	 */
	setDayDuration(duration) {
		this._dayDuration = duration;
	}

	/**
	 * Retorna se a animação está ativa
	 * @returns {boolean}
	 */
	isAnimating() {
		return this._animate;
	}
}
