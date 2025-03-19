import { LightingManager } from "./lighting/LightingManager";
import { WeatherManager } from "./weather/WeatherManager";
import { TimeManager } from "./time/TimeManager";
import { AtmosphereManager } from "./atmosphere/AtmosphereManager";
import { WorldConfig } from "./WorldConfig";

/**
 * Central class for managing all environmental aspects of the game
 */
export class EnvironmentManager {
	/**
	 * @param {THREE.Scene} scene The scene where the environment will be applied
	 * @param {object} options Configuration options
	 */
	constructor(scene, options = {}) {
		this.scene = scene;

		// Creates or uses the provided world configuration
		this.worldConfig = options.worldConfig || new WorldConfig();

		// Initializes subsystems with proper dependency injection
		this.timeManager = options.timeManager || new TimeManager();

		// Registers the timeManager in worldConfig for cross-reference
		this.worldConfig.setTimeManager(this.timeManager);

		this.lightingManager =
			options.lightingManager ||
			new LightingManager(scene, { worldConfig: this.worldConfig });

		this.weatherManager =
			options.weatherManager || new WeatherManager(scene);

		this.atmosphereManager =
			options.atmosphereManager || new AtmosphereManager(scene);

		// Sets up listeners for time changes
		this.setupTimeListeners();
	}

	/**
	 * Sets up listeners for time notifications
	 * @private
	 */
	setupTimeListeners() {
		this.timeManager.addListener(this.lightingManager);
		this.timeManager.addListener(this.weatherManager);
		this.timeManager.addListener(this.atmosphereManager);
	}

	/**
	 * Updates world dimensions when they change
	 * @param {number} width New width
	 * @param {number} height New height
	 */
	updateWorldDimensions(width, height) {
		this.worldConfig.updateDimensions(width, height);

		// Atualiza as configurações de sombra das luzes quando o tamanho do mundo muda
		this.lightingManager.updateWorldDimensions();
	}

	/**
	 * Applies a weather effect
	 * @param {string} type Effect type ('rain', 'fog', etc)
	 * @param {object} options Options for the effect
	 */
	applyWeatherEffect(type, options = {}) {
		this.weatherManager.applyEffect(type, options);
	}

	/**
	 * Removes a weather effect
	 * @param {string} type Effect type
	 */
	removeWeatherEffect(type) {
		this.weatherManager.removeEffect(type);
	}

	update(deltaTime) {
		// Updates time first as other systems depend on it
		this.timeManager.update(deltaTime);

		this.atmosphereManager.update(deltaTime);
		this.weatherManager.update(deltaTime);

		// Added to ensure the LightingManager is also updated
		this.lightingManager.update(deltaTime);
	}

	/**
	 * Obtém o horário do mundo formatado
	 * @returns {string} Horário formatado (hh:mm)
	 */
	getFormattedWorldTime() {
		return this.timeManager.getFormattedTime();
	}

	/**
	 * Obtém a temporada atual como string
	 * @returns {string} Nome da temporada atual
	 */
	getCurrentSeasonName() {
		const seasonNames = ["Spring", "Summer", "Autumn", "Winter"];
		return seasonNames[this.timeManager.season];
	}
}
