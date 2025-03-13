import { Action } from "./Action";
import { search } from "../pathfinding";
import { GameObject } from "../objects/GameObject";

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
		clearInterval(this.pathUpdater);
		// Only visualize the path if debug is enabled
		if (
			this.world.showPathDebug &&
			this.path != null &&
			this.path.length > 0
		) {
			this.path.forEach((coords, index) => {
				const geometry = new THREE.BoxGeometry(0.2, 0.1, 0.2);
				let color = 0xffa500; // default color (orange)
				if (index === 0) color = 0x0000ff; // start box (blue)
				if (index === this.path.length - 1) color = 0xff0000; // end box (red)
				const material = new THREE.MeshStandardMaterial({
					color: color,
					opacity: 0.9,
					transparent: true,
				});
				const mesh = new THREE.Mesh(geometry, material);
				mesh.position.set(coords.x + 0.5, 0.5, coords.z + 0.5);
				this.world.path.add(mesh);
			});
		}

		// Trigger interval function to update player's position
		this.pathIndex = 0;
		this.pathUpdater = setInterval(this.updatePosition.bind(this), 500);
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

	updatePosition() {
		if (this.pathIndex === this.path.length) {
			clearInterval(this.pathUpdater);
			return;
		}
		const curr = this.path[this.pathIndex++];
		this.moveTo(curr);
	}
}
