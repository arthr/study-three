import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import Stats from "three/addons/libs/stats.module.js";
import GUI from "lil-gui";
import { World } from "./world";
import { HumanPlayer } from "./players/HumanPlayer";

const gui = new GUI();

const stats = new Stats();
document.body.appendChild(stats.dom);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setAnimationLoop(animate);
renderer.setPixelRatio(devicePixelRatio);
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
	75,
	window.innerWidth / window.innerHeight,
	0.5,
	1000
);

const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(5, -0.5, 5);
camera.position.set(-1.15, 6.5, 5);

// Movimento da câmera
controls.enablePan = false;

// Rotação da câmera
controls.enableRotate = true;

// Zoom da câmera
controls.enableZoom = true;
controls.maxDistance = 10;
controls.minDistance = 5;

// Suavização do movimento da câmera
controls.enableDamping = true;
controls.dampingFactor = 0.1;

controls.update();

const world = new World(10, 10);
scene.add(world);

const player = new HumanPlayer(new THREE.Vector3(1, 0.5, 1), camera, world);
scene.add(player);

const sun = new THREE.DirectionalLight(0xffffff, 1);
sun.position.set(1, 2, 3);
sun.intensity = 2;
scene.add(sun);

const ambient = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambient);

camera.position.z = 5;

controls.update();

function animate() {
	controls.update();
	renderer.render(scene, camera);
	stats.update();
}

window.addEventListener("resize", () => {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
});

const worldFolder = gui.addFolder("World");
worldFolder.add(world, "width", 1, 20, 1).name("Width");
worldFolder.add(world, "height", 1, 20, 1).name("Height");
worldFolder.addColor(world.terrain.material, "color").name("Color");
worldFolder.add(world, "treeCount", 1, 100, 1).name("Tree Count");
worldFolder.add(world, "rockCount", 1, 100, 1).name("Rock Count");
worldFolder.add(world, "bushCount", 1, 100, 1).name("Bush Count");
worldFolder.add(world, "textureWired").name("Texture Wired");
worldFolder.add(world, "showPathDebug").name("Show Path Debug");
worldFolder.add(world.terrain.material, "wireframe").name("Wireframe");
worldFolder.add(world, "generate").name("Generate");

const action = await player.requestAction();
await action.canPerform();
