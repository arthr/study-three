import * as THREE from "three";
import { GameObject } from "./GameObject";

const rockMaterial = new THREE.MeshStandardMaterial({
	color: 0x808080,
	flatShading: true,
});

const rockGeometry = new THREE.SphereGeometry(1, 6, 5);

export class Rock extends GameObject {
	minRockRadius = 0.2;
	maxRockRadius = 0.4;
	minRockHeight = 0.1;
	maxRockHeight = 0.3;
	/**
	 * @param {THREE.Vector3} coords
	 * @param {THREE.BufferGeometry} geometry
	 * @param {THREE.Material} material
	 */
	constructor(coords) {
		super(coords, rockGeometry, rockMaterial);

		this.name = `Rock-(x:${coords.x}, z:${coords.z})`;

		const radius =
			this.minRockRadius +
			Math.random() * (this.maxRockRadius - this.minRockRadius);
		const height =
			this.minRockHeight +
			Math.random() * (this.maxRockHeight - this.minRockHeight);

		this.scale.set(radius, height, radius);
		this.position.set(
			coords.x + 0.5,
			coords.y + height / 4,
			coords.z + 0.5
		);
	}
}
