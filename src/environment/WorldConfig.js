import * as THREE from "three";

/**
 * Class that centralizes world configurations for use
 * by environmental systems
 */
export class WorldConfig {
	/**
	 * @param {object} options Configuration options
	 * @param {number} [options.width=10] World width
	 * @param {number} [options.height=10] World height
	 * @param {object} [options.timeManager=null] Time manager
	 */
	constructor(options = {}) {
		const { width = 10, height = 10, timeManager = null } = options;
		this.width = width;
		this.height = height;
		this.timeManager = timeManager;
	}

	/**
	 * Returns the center of the world
	 * @returns {THREE.Vector3}
	 */
	getCenter() {
		return new THREE.Vector3(this.width / 2, 0, this.height / 2);
	}

	/**
	 * Returns the largest dimension of the world (useful for distance calculations)
	 * @returns {number}
	 */
	getMaxDimension() {
		return Math.max(this.width, this.height);
	}

	/**
	 * Updates the world dimensions
	 * @param {number} width
	 * @param {number} height
	 */
	updateDimensions(width, height) {
		this.width = width;
		this.height = height;
	}

	/**
	 * Sets the time manager
	 * @param {object} timeManager
	 */
	setTimeManager(timeManager) {
		this.timeManager = timeManager;
	}
}
