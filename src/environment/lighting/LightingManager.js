import * as THREE from "three";
import { LightFactory } from "./LightFactory";
import { WorldConfig } from "../WorldConfig";

/**
 * Class responsible for managing lights in the scene
 */
export class LightingManager {
	/**
	 * @type {Map<string, THREE.Light>}
	 * @private
	 */
	lights = new Map();

	/**
	 * @param {THREE.Scene} scene The scene to add lights to
	 * @param {object} options Configuration options
	 */
	constructor(scene, options = {}) {
		this.scene = scene;
		this.worldConfig = options.worldConfig || new WorldConfig();
	}

	/**
	 * Creates and adds a light to the scene
	 * @param {string} type Light type ('sun', 'ambient', etc)
	 * @param {string} name Unique name for the light
	 * @param {object} options Configuration options
	 * @returns {THREE.Light} The created light
	 */
	createLight(type, name, options = {}) {
		if (this.lights.has(name)) {
			console.warn(
				`Light with name '${name}' already exists. Replacing.`
			);
			this.removeLight(name);
		}

		// Passes the worldConfig so lights can access world information
		const lightOptions = {
			...options,
			worldConfig: this.worldConfig,
		};

		const light = LightFactory.createLight(type, lightOptions);
		this.scene.add(light);

		// Adds helper elements if they exist
		if (typeof light.getHelper === "function") {
			const helper = light.getHelper();
			if (helper) {
				this.scene.add(helper);
			}
		}

		// Adds the target if it exists (as in the case of directional lights)
		if (light.target) {
			this.scene.add(light.target);
		}

		this.lights.set(name, light);
		return light;
	}

	/**
	 * Removes a light from the scene by name
	 * @param {string} name Light name
	 */
	removeLight(name) {
		const light = this.lights.get(name);
		if (light) {
			this.scene.remove(light);
			if (light.helper) this.scene.remove(light.helper);
			if (light.target) this.scene.remove(light.target);
			this.lights.delete(name);
		}
	}

	/**
	 * Implements onTimeUpdate to respond to time changes
	 * @param {object} timeInfo Time information
	 */
	onTimeUpdate(timeInfo) {
		// Delegates the update to each light that implements onTimeUpdate
		this.lights.forEach((light) => {
			if (typeof light.onTimeUpdate === "function") {
				light.onTimeUpdate(timeInfo);
			}
		});

		// Synchronizes Sun and Moon if both exist
		this.syncSunAndMoon(timeInfo);
	}

	/**
	 * Synchronizes the Sun and Moon
	 * @param {object} timeInfo Time information
	 * @private
	 */
	syncSunAndMoon(timeInfo) {
		const sunLight = this.lights.get("sun");
		const moonLight = this.lights.get("moon");

		if (
			moonLight &&
			sunLight &&
			typeof moonLight.positionOppositeSun === "function"
		) {
			// Synchronizes orbital tilt between sun and moon
			if (
				typeof sunLight.getOrbitalTilt === "function" &&
				typeof moonLight.setOrbitalTilt === "function"
			) {
				const sunTilt = sunLight.getOrbitalTilt();
				moonLight.setOrbitalTilt(sunTilt);
			}

			// Uses the world center from the centralized configuration
			const worldCenter = this.worldConfig.getCenter();

			// Passes the world center to position the moon
			moonLight.positionOppositeSun(sunLight.position, worldCenter);

			// Adjusts moon intensity based on day/night cycle
			// The moon is brighter when the sun is below the horizon
			const sunHeight = Math.sin(timeInfo.dayTime * Math.PI * 2);
			const baseIntensity = moonLight.userData.baseIntensity || 2;

			// Adjusts to a minimum value of 0.1 when the sun is high
			// and maximum of the base value when the sun is completely below the horizon
			moonLight.intensity =
				baseIntensity * (0.1 + 0.9 * (1 - Math.max(0, sunHeight)));
		}
	}

	/**
	 * Updates all lights that have an update method
	 * @param {number} deltaTime Time since the last frame in seconds
	 */
	update(deltaTime) {
		this.lights.forEach((light) => {
			if (typeof light.update === "function") {
				light.update(deltaTime);
			}
		});
	}

	/**
	 * Returns a light by its name
	 * @param {string} name The name of the light
	 * @returns {THREE.Light|null} The found light or null
	 */
	getLight(name) {
		return this.lights.get(name) || null;
	}

	/**
	 * Atualiza as dimensões do mundo nas luzes que suportam essa função
	 */
	updateWorldDimensions() {
		this.lights.forEach((light) => {
			if (typeof light.updateWorldSize === "function") {
				light.updateWorldSize();
			}
		});
	}
}
