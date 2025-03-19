import { RainEffect } from "./effects/RainEffect";
import { FogEffect } from "./effects/FogEffect";

export class EffectFactory {
	static createEffect(type, scene, options) {
		switch (type) {
			case "rain":
				return new RainEffect(scene, options);
			case "fog":
				return new FogEffect(scene, options);
			default:
				throw new Error(`Efeito desconhecido: ${type}`);
		}
	}
}
