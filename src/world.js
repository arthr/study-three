import * as THREE from "three";

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

	/**
	 * Returns a key for for the object map given the coordinates.
	 * @param {THREE.Vector2} coords
	 * @returns
	 */
	getKey = (coords) => `${coords.x}-${coords.y}`;

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
			this.remove(this.terrain);
		}

		if (this.trees) {
			this.trees.children.forEach((tree) => {
				tree.geometry.dispose();
				tree.material.dispose();
			});
			this.trees.clear();
		}

		if (this.rocks) {
			this.rocks.children.forEach((rock) => {
				rock.geometry.dispose();
				rock.material.dispose();
			});
			this.rocks.clear();
		}

		if (this.bushes) {
			this.bushes.children.forEach((bush) => {
				bush.geometry.dispose();
				bush.material.dispose();
			});
			this.bushes.clear();
		}

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
		const terrainGeometry = new THREE.PlaneGeometry(
			this.width,
			this.height,
			this.width,
			this.height
		);
		this.terrain = new THREE.Mesh(terrainGeometry, terrainMaterial);
		this.terrain.name = "Terrain";
		this.terrain.rotation.x = -Math.PI / 2;
		this.terrain.position.set(this.width / 2, 0, this.height / 2);
		this.add(this.terrain);
	}

	createTrees() {
		const treeRadius = 0.2;
		const treeHeight = 1;

		const treeMaterial = new THREE.MeshStandardMaterial({
			color: 0x228b22,
			flatShading: true,
		});

		for (let i = 0; i < this.treeCount; i++) {
			const coords = new THREE.Vector2(
				Math.floor(this.width * Math.random()),
				Math.floor(this.height * Math.random())
			);

			if (this.#objectMap.has(this.getKey(coords))) continue;

			const treeGeometry = new THREE.ConeGeometry(
				treeRadius,
				treeHeight,
				8
			);
			const treeMesh = new THREE.Mesh(treeGeometry, treeMaterial);
			treeMesh.name = `Tree #${String(i).padStart(3, "0")} (x:${
				coords.x
			}, y:${coords.y})`;

			treeMesh.position.set(
				coords.x + 0.5,
				treeHeight / 2,
				coords.y + 0.5
			);
			this.trees.add(treeMesh);

			this.#objectMap.set(this.getKey(coords), treeMesh);
		}
	}

	createRocks() {
		const minRockRadius = 0.1;
		const maxRockRadius = 0.3;
		const minRockHeight = 0.4;
		const maxRockHeight = 0.8;

		const rockMaterial = new THREE.MeshStandardMaterial({
			color: 0x808080,
			flatShading: true,
		});

		for (let i = 0; i < this.rockCount; i++) {
			const radius =
				Math.random() * (maxRockRadius - minRockRadius) + minRockRadius;
			const height =
				Math.random() * (maxRockHeight - minRockHeight) + minRockHeight;

			const coords = new THREE.Vector2(
				Math.floor(this.width * Math.random()),
				Math.floor(this.height * Math.random())
			);

			if (this.#objectMap.has(this.getKey(coords))) continue;

			const rockGeometry = new THREE.SphereGeometry(radius, 6, 5);
			const rockMesh = new THREE.Mesh(rockGeometry, rockMaterial);
			rockMesh.name = `Rock #${String(i).padStart(3, "0")} (x:${
				coords.x
			}, y:${coords.y})`;

			rockMesh.position.set(coords.x + 0.5, 0, coords.y + 0.5);
			rockMesh.scale.y = height;
			this.rocks.add(rockMesh);

			this.#objectMap.set(this.getKey(coords), rockMesh);
		}
	}

	createBushes() {
		const minBushRadius = 0.1;
		const maxBushRadius = 0.3;

		const bushMaterial = new THREE.MeshStandardMaterial({
			color: 0x32cd32,
			flatShading: true,
		});

		for (let i = 0; i < this.bushCount; i++) {
			const radius =
				Math.random() * (maxBushRadius - minBushRadius) + minBushRadius;

			const coords = new THREE.Vector2(
				Math.floor(this.width * Math.random()),
				Math.floor(this.height * Math.random())
			);

			if (this.#objectMap.has(this.getKey(coords))) continue;

			const bushGeometry = new THREE.SphereGeometry(radius, 6, 5);
			const bushMesh = new THREE.Mesh(bushGeometry, bushMaterial);
			bushMesh.name = `Bush #${String(i).padStart(3, "0")} (x:${
				coords.x
			}, y:${coords.y})`;

			bushMesh.position.set(coords.x + 0.5, radius, coords.y + 0.5);

			this.bushes.add(bushMesh);

			this.#objectMap.set(this.getKey(coords), bushMesh);
		}
	}

	/**
	 * Returns the object at the given coordinates or null if no object is found.
	 * @param {THREE.Vector2} coords
	 * @returns {object | null}
	 */
	getObject(coords) {
		return this.#objectMap.get(this.getKey(coords)) ?? null;
	}
}
