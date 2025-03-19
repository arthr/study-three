import * as THREE from "three";
import { EffectFactory } from "./EffectFactory";

export class WeatherManager {
	constructor(scene) {
		this.scene = scene;
		this.activeEffects = new Map();
	}

	/**
	 * Aplica um efeito climático
	 * @param {string} type Tipo de efeito ('rain', 'snow', 'fog', etc)
	 * @param {object} options Opções para o efeito
	 */
	applyEffect(type, options = {}) {
		const effect = EffectFactory.createEffect(type, this.scene, options);
		if (effect) {
			this.activeEffects.set(type, effect);
			effect.start();
		}
	}

	/**
	 * Remove um efeito climático
	 */
	removeEffect(type) {
		const effect = this.activeEffects.get(type);
		if (effect) {
			effect.stop();
			this.activeEffects.delete(type);
		}
	}

	/**
	 * Responde a mudanças no tempo
	 */
	onTimeUpdate(timeInfo) {
		// Lógica para mudar o clima com base no tempo/estação
		// Por exemplo, mais chances de chuva durante certas estações
		// ou mudar a densidade da névoa com base na hora do dia
	}

	update(deltaTime) {
		this.activeEffects.forEach((effect) => {
			effect.update(deltaTime);
		});
	}
}
