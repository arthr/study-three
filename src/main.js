import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import Stats from "three/addons/libs/stats.module.js";
import GUI from "lil-gui";
import { World } from "./world";

const gui = new GUI();

const stats = new Stats();
stats.showPanel(0);
document.body.appendChild(stats.dom);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);

renderer.setAnimationLoop(animate);

document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
	75,
	window.innerWidth / window.innerHeight,
	0.1,
	1000
);
camera.position.set(10, 2, 10);

const controls = new OrbitControls(camera, renderer.domElement);

const world = new World(10, 10);
scene.add(world);

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
worldFolder.add(world, "generate").name("Generate");
