import * as THREE from "three";
import { Bush } from "./objects/Bush";
import { GameObject } from "./objects/GameObject";
import { Tree } from "./objects/Tree";
import { Rock } from "./objects/Rock";
import { getKey } from "./utils";

const textureLoader = new THREE.TextureLoader();
const gridTexture = textureLoader.load("textures/grid.png");
const gridTextureWire = textureLoader.load("textures/grid-wire.png");

export class World extends THREE.Group {
	#objectMap = new Map();

	/**
	 * Active/Deactive the wired texture.
	 * @type {boolean}
	 */
	#textureWired = true;

	/**
	 * Show/Hide path debug visualization.
	 * @type {boolean}
	 */
	#showPathDebug = true;

	// just for debugging
	path = new THREE.Group();

	constructor(width, height) {
		super();

		this.width = width;
		this.height = height;

		this.treeCount = 10;
		this.rockCount = 20;
		this.bushCount = 10;

		this.trees = new THREE.Group();
		this.add(this.trees);

		this.rocks = new THREE.Group();
		this.add(this.rocks);

		this.bushes = new THREE.Group();
		this.add(this.bushes);

		this.path = new THREE.Group();
		this.add(this.path);

		this.generate();
	}

	get textureWired() {
		return this.#textureWired;
	}

	set textureWired(value) {
		this.#textureWired = value;
		if (this.terrain) {
			this.createTerrain();
		}
	}

	get showPathDebug() {
		return this.#showPathDebug;
	}

	set showPathDebug(value) {
		this.#showPathDebug = value;
		if (!value) {
			this.path.clear();
		}
	}

	generate() {
		this.clear();
		this.createTerrain();
		this.createTrees();
		this.createRocks();
		this.createBushes();
	}

	clear() {
		if (this.terrain) {
			this.terrain.geometry.dispose();
			this.terrain.material.dispose();
		}
		this.remove(this.terrain);

		this.trees.clear();
		this.rocks.clear();
		this.bushes.clear();

		this.#objectMap.clear();
	}

	createTerrain() {
		// Seleciona a textura baseada no valor de textureWired
		const currentTexture = this.textureWired
			? gridTextureWire
			: gridTexture;

		currentTexture.repeat = new THREE.Vector2(this.width, this.height);
		currentTexture.wrapS = THREE.RepeatWrapping;
		currentTexture.wrapT = THREE.RepeatWrapping;
		currentTexture.colorSpace = THREE.SRGBColorSpace;

		// Preserva o valor atual do wireframe se o terreno já existe
		const wireframeValue = this.terrain?.material?.wireframe || false;

		const terrainMaterial = new THREE.MeshStandardMaterial({
			map: currentTexture,
			wireframe: wireframeValue,
		});

		const terrainGeometry = new THREE.BoxGeometry(
			this.width,
			0.1,
			this.height
		);

		this.terrain = new THREE.Mesh(terrainGeometry, terrainMaterial);
		this.terrain.name = "Terrain";
		this.terrain.receiveShadow = true;
		this.terrain.position.set(this.width / 2, -0.05, this.height / 2);
		this.add(this.terrain);
	}

	createTrees() {
		for (let i = 0; i < this.treeCount; i++) {
			const coords = new THREE.Vector3(
				Math.floor(this.width * Math.random()),
				0,
				Math.floor(this.height * Math.random())
			);

			const tree = new Tree(coords);
			this.addObject(tree, coords, this.trees);
		}
	}

	createRocks() {
		for (let i = 0; i < this.rockCount; i++) {
			const coords = new THREE.Vector3(
				Math.floor(this.width * Math.random()),
				0,
				Math.floor(this.height * Math.random())
			);

			const rock = new Rock(coords);
			this.addObject(rock, coords, this.rocks);
		}
	}

	createBushes() {
		for (let i = 0; i < this.bushCount; i++) {
			const coords = new THREE.Vector3(
				Math.floor(this.width * Math.random()),
				0,
				Math.floor(this.height * Math.random())
			);

			const bush = new Bush(coords);
			this.addObject(bush, coords, this.bushes);
		}
	}

	/**
	 * Adds an object to the object map at the given coordinates unless
	 * an object already exists at the given coordinates.
	 * @param {GameObject} object
	 * @param {THREE.Vector3} coords
	 * @param {THREE.Group} group The group to add the object to.
	 * @returns
	 */
	addObject(object, coords, group) {
		// Don't add an object if there is already an object at the given coordinates
		if (this.#objectMap.has(getKey(coords))) {
			return false;
		}

		group.add(object);
		this.#objectMap.set(getKey(coords), object);

		return true;
	}

	/**
	 * Returns the object at the given coordinates or null if no object is found.
	 * @param {THREE.Vector3} coords
	 * @returns {object | null}
	 */
	getObject(coords) {
		return this.#objectMap.get(getKey(coords)) ?? null;
	}
}
