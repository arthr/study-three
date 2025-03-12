import * as THREE from "three";

export class GameObject extends THREE.Mesh {
	/**
	 * @type {THREE.Vector3}
	 */
	coords;

	/**
	 * @param {THREE.Vector3} coords
	 * @param {THREE.BufferGeometry} geometry
	 * @param {THREE.Material} material
	 */
	constructor(coords, geometry, material) {
		super(geometry, material);
		this.coords = coords;
	}
}
