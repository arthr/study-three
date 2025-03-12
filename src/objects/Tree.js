import * as THREE from "three";
import { GameObject } from "./GameObject";

const treeMaterial = new THREE.MeshStandardMaterial({
	color: 0x228b22,
	flatShading: true,
});

const treeGeometry = new THREE.ConeGeometry(0.2, 1, 8);

export class Tree extends GameObject {
	/**
	 * @param {THREE.Vector3} coords
	 * @param {THREE.BufferGeometry} geometry
	 * @param {THREE.Material} material
	 */
	constructor(coords) {
		super(coords, treeGeometry, treeMaterial);

		this.name = `Tree-(x:${coords.x}, z:${coords.z})`;

		this.position.set(coords.x + 0.5, coords.y + 0.5, coords.z + 0.5);
	}
}
