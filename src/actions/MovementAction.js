import * as THREE from "three";
import { Action } from "./Action";
import { search } from "../pathfinding";
import { GameObject } from "../objects/GameObject";

const breadcrumb = new THREE.Mesh(
	new THREE.BoxGeometry(0.2, 0.1, 0.2),
	new THREE.MeshStandardMaterial({
		color: 0xffa500,
		opacity: 0.9,
		transparent: true,
	})
);

export class MovementAction extends Action {
	name = "MovementAction";

	path = [];
	pathIndex = 0;
	pathUpdater = null;
	/**
	 * @type {GameObject} source
	 * @type {World} world
	 */
	constructor(source, world) {
		super(source);
		this.world = world;
	}

	async perform() {
		return new Promise((resolve) => {
			function updaterSourcePosition() {
				// If the path is finished, clear the interval
				if (this.pathIndex === this.path.length) {
					clearInterval(this.pathUpdater);
					this.world.path.clear();
					resolve();
					// Otherwise, move the player to the next position in the path
				} else {
					const curr = this.path[this.pathIndex++];
					this.source.moveTo(curr);
				}
			}

			clearInterval(this.pathUpdater);
			// Only visualize the path if debug is enabled
			if (
				this.world.showPathDebug &&
				this.path != null &&
				this.path.length > 0
			) {
				this.path.forEach((coords, index) => {
					console.log(
						`Path lenght: ${this.path.length}, index: ${index}`,
						index === this.path.length - 1
					);
					let color = 0xffa500; // default color (orange)
					if (index === 0) color = 0x0000ff; // start box (blue)
					if (index === this.path.length - 1) color = 0xff0000; // end box (red)

					const mesh = breadcrumb.clone();
					// Criar uma cópia do material para cada breadcrumb
					mesh.material = mesh.material.clone();
					mesh.material.color.setHex(color);

					mesh.position.set(coords.x + 0.5, 0.5, coords.z + 0.5);
					this.world.path.add(mesh);
				});
			}

			// Trigger interval function to update player's position
			this.pathIndex = 0;
			this.pathUpdater = setInterval(
				updaterSourcePosition.bind(this),
				300
			);
		});
	}

	async canPerform() {
		const selectedCoords = await this.source.getTargetSquare();

		console.log("canPerform", selectedCoords);

		// Find path from player's current position to the selected square
		this.path = search(this.source.coords, selectedCoords, this.world);

		console.log(this.path);
		// If path is found, return true
		return this.path !== null && this.path.length >= 0;
	}
}
