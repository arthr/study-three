import * as THREE from "three";
import { search } from "./pathfinding";
import { GameObject } from "./objects/GameObject";
import { World } from "./world";

const geometry = new THREE.CapsuleGeometry(0.25, 0.5);
const material = new THREE.MeshStandardMaterial({ color: 0x4040c0 });

export class Player extends GameObject {
	/**
	 * @type {THREE.Raycaster}
	 */
	raycaster = new THREE.Raycaster();

	path = [];
	pathIndex = 0;
	pathUpdater = null;

	/**
	 * Instantiates a new instance of the player
	 * @param {THREE.Vector3} coords
	 * @param {THREE.Camera} camera
	 * @param {World} world
	 */
	constructor(coords, camera, world) {
		super(coords, geometry, material);

		this.name = "Player";
		this.moveTo(coords);

		this.camera = camera;
		this.world = world;

		window.addEventListener("mousedown", this.onMouseDown.bind(this));
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
	 *
	 * @param {MouseEvent} event
	 */
	onMouseDown(event) {
		const coords = new THREE.Vector2(
			(event.clientX / window.innerWidth) * 2 - 1,
			-(event.clientY / window.innerHeight) * 2 + 1
		);

		this.raycaster.setFromCamera(coords, this.camera);
		const intersections = this.raycaster.intersectObject(
			this.world.terrain
		);

		if (intersections && intersections.length > 0) {
			const playerCoords = new THREE.Vector3(
				Math.floor(this.position.x),
				Math.floor(this.position.y),
				Math.floor(this.position.z)
			);

			const selectedCoords = new THREE.Vector3(
				Math.floor(intersections[0].point.x),
				0,
				Math.floor(intersections[0].point.z)
			);

			this.world.path.clear();
			clearInterval(this.pathUpdater);

			// Find path from player's current position to the selected square
			this.path = search(playerCoords, selectedCoords, this.world);

			// If no path was found, return early
			if (this.path == null || this.path.length === 0) return;

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
