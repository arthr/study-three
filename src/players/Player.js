import * as THREE from "three";
import { GameObject } from "../objects/GameObject";
import { World } from "../world";
import { Action } from "../actions/Action";
import { MovementAction, WaitAction } from "../actions";

const geometry = new THREE.CapsuleGeometry(0.25, 0.5);

/**
 * Base player class that human and AI players will extend
 */
export class Player extends GameObject {
	name = "Player";

	#originalMaterial = null;
	#originalScale = new THREE.Vector3(1, 1, 1);

	/**
	 * Instantiates a new instance of the player
	 * @param {THREE.Vector3} coords
	 * @param {THREE.Camera} camera
	 * @param {World} world
	 */
	constructor(coords, camera, world) {
		const material = new THREE.MeshStandardMaterial({ color: 0x4040c0 });
		super(coords, geometry, material);
		this.moveTo(coords);
		this.camera = camera;
		this.world = world;
	}

	/**
	 * @returns {Action[]}
	 */
	getActions() {
		return [new MovementAction(this, this.world), new WaitAction(this)];
	}

	/**
	 * Wait for the player to choose a target gameObject
	 * @returns {Promise<GameObject | null>}
	 */
	async getTargetObject() {
		return null;
	}

	/**
	 * Wait for the player to choose an action
	 * @returns {Promise<Action | null>}
	 */
	async requestAction() {
		return null;
	}

	/**
	 * Highlight the player to indicate that it is their turn
	 * @returns {void}
	 */
	highlight() {
		// Store the original material and scale
		if (!this.#originalMaterial) {
			this.#originalMaterial = this.material.clone();
			this.#originalScale.copy(this.scale);
		}

		// Apply a blue emissive color to indicate the player's turn
		this.material.emissive = new THREE.Color(0x994444);
		this.material.emissiveIntensity = 1;

		// Change the scale to indicate that the player is active
		this.scale.set(1.1, 1.1, 1.1);
	}

	/**
	 * Remove the highlight from the player
	 * @returns {void}
	 */
	unhighlight() {
		// Restore to the original material
		if (this.#originalMaterial) {
			this.material.emissive = this.#originalMaterial.emissive;
			this.material.emissiveIntensity =
				this.#originalMaterial.emissiveIntensity;
		}

		// Restore to the original scale
		this.scale.copy(this.#originalScale);
	}
}
