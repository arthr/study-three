import * as THREE from "three";
import { GameObject } from "../objects/GameObject";
import { World } from "../world";
import { Action } from "../actions/Action";
import { MovementAction } from "../actions/MovementAction";

const geometry = new THREE.CapsuleGeometry(0.25, 0.5);
const material = new THREE.MeshStandardMaterial({ color: 0x4040c0 });

/**
 * Base player class that human and AI players will extend
 */
export class Player extends GameObject {
	name = "Player";

	/**
	 * Instantiates a new instance of the player
	 * @param {THREE.Vector3} coords
	 * @param {THREE.Camera} camera
	 * @param {World} world
	 */
	constructor(coords, camera, world) {
		super(coords, geometry, material);

		this.moveTo(coords);

		this.camera = camera;
		this.world = world;
	}

	/**
	 * Moves the player to the specified coordinates
	 * @param {THREE.Vector3} coords
	 */
	moveTo(coords) {
		this.coords = coords;
		this.position.set(this.coords.x + 0.5, 0.5, this.coords.z + 0.5);
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
}
