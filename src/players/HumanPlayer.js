import * as THREE from "three";
import { Player } from "./Player";
import { MovementAction } from "../actions/MovementAction";

export class HumanPlayer extends Player {
	name = "Human Player";

	/**
	 * @type {THREE.Raycaster}
	 */
	raycaster = new THREE.Raycaster();

	/**
	 * Wait for the player to choose a target square
	 * @returns {Promise<THREE.Vector3 | null>}
	 */
	async getTargetSquare() {
		return new Promise((resolve) => {
			/**
			 * Event handler for click events on the window
			 * @param {MouseEvent} event
			 */
			const onMouseDown = (event) => {
				const coords = new THREE.Vector2(
					(event.clientX / window.innerWidth) * 2 - 1,
					-(event.clientY / window.innerHeight) * 2 + 1
				);

				this.raycaster.setFromCamera(coords, this.camera);
				const intersections = this.raycaster.intersectObject(
					this.world.terrain
				);

				if (intersections && intersections.length > 0) {
					const selectedCoords = new THREE.Vector3(
						Math.floor(intersections[0].point.x),
						0,
						Math.floor(intersections[0].point.z)
					);
					console.log("Selected Coords: ", selectedCoords);
					window.removeEventListener("mousedown", onMouseDownBound);
					resolve(selectedCoords ? selectedCoords : null);
				}
			};

			const onMouseDownBound = onMouseDown.bind(this);

			// Wait for the player to click on the window to select a square
			window.addEventListener("mousedown", onMouseDownBound);
			console.log("Waiting for player to select a square...");
		});
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
		console.log(`Player ${this.name} is requesting an action...`);
		const selectedAction = new MovementAction(this, this.world);
		console.log(
			`Player ${this.name} selected action: ${selectedAction.name}`
		);
		return selectedAction;
	}
}
