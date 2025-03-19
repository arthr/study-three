import * as THREE from "three";
import { Player } from "./Player";
import { Action } from "../actions";

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
		const statusText = document.getElementById("status-text");
		const actionButtonContainer = document.getElementById("actions");

		actionButtonContainer.innerHTML = "";

		const actions = this.getActions();

		statusText.textContent = `Waiting for ${this.name} to select an action...`;
		return new Promise((resolve) => {
			/**
			 * Event handler for click events on the action buttons
			 * @param {MouseEvent} event
			 */
			const onActionClick = (event) => {
				const actionName = event.target.textContent;
				const action = actions.find((a) => a.name === actionName);
				statusText.textContent = `${this.name} selected: ${action.name}`;
				console.log(`${this.name} selected: ${action.name}`);
				actionButtonContainer.innerHTML = "";
				window.removeEventListener("click", onActionClickBound);
				resolve(action);
			};

			const onActionClickBound = onActionClick.bind(this);

			// Wait for the player to click on an action button
			window.addEventListener("click", onActionClickBound);
			statusText.textContent = `Waiting for ${this.name} to select an action...`;

			// Display action buttons
			actions.forEach((action) => {
				const button = document.createElement("button");
				button.textContent = action.name;
				actionButtonContainer.appendChild(button);
			});
		});
	}
}
