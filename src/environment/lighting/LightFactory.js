import * as THREE from "three";
import { SunLight } from "./SunLight";
import { MoonLight } from "./MoonLight";
import { FireLight } from "./FireLight";
import { WorldConfig } from "../WorldConfig";

/**
 * Factory para criação de diferentes tipos de luz
 */
export class LightFactory {
	/**
	 * Cria uma luz baseada no tipo especificado
	 * @param {string} type Tipo de luz ('sun', 'moon', 'ambient', 'point', 'fire', etc)
	 * @param {object} options Opções de configuração
	 * @returns {THREE.Light} A luz criada
	 */
	static createLight(type, options = {}) {
		// Garante que temos uma configuração de mundo
		const worldConfig = options.worldConfig || new WorldConfig();

		// Passa o worldConfig para todas as opções
		const extendedOptions = {
			...options,
			worldConfig,
		};

		switch (type.toLowerCase()) {
			case "sun":
				return new SunLight(extendedOptions);
			case "moon":
				return new MoonLight(extendedOptions);
			case "ambient":
				return new THREE.AmbientLight(
					options.color || 0xffffff,
					options.intensity || 0.5
				);
			case "fire":
				return new FireLight(extendedOptions);
			case "point":
				return new THREE.PointLight(
					options.color || 0xffffff,
					options.intensity || 1,
					options.distance || 0,
					options.decay || 2
				);
			default:
				throw new Error(`Tipo de luz não suportado: ${type}`);
		}
	}
}
