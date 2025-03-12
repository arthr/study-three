import * as THREE from "three";
import { GameObject } from "./GameObject";

const bushMaterial = new THREE.MeshStandardMaterial({
	color: 0x32cd32,
	flatShading: true,
});

const bushGeometry = new THREE.SphereGeometry(1, 8, 8);

export class Bush extends GameObject {
	minBushRadius = 0.1;
	maxBushRadius = 0.3;

	/**
	 * @param {THREE.Vector3} coords
	 */
	constructor(coords) {
		super(coords, bushGeometry, bushMaterial);

		this.name = `Bush-(x:${coords.x}, z:${coords.z})`;

		const radius =
			this.minBushRadius +
			Math.random() * (this.maxBushRadius - this.minBushRadius);

		this.scale.set(radius, radius, radius);
		this.position.set(coords.x + 0.5, coords.y + radius, coords.z + 0.5);
	}
}
