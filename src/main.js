import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import Stats from "three/addons/libs/stats.module.js";
import GUI from "lil-gui";
import { World } from "./world";
import { HumanPlayer } from "./players/HumanPlayer";
import { CombatManager } from "./CombatManager";
import { EnvironmentManager } from "./environment/EnvironmentManager";
import { setupEnvironmentGUI } from "./environment/EnvironmentGUI";
import { WorldConfig } from "./environment/WorldConfig";

const gui = new GUI();
gui.$title.innerHTML = "Debug Controls Panel";

const stats = new Stats();
document.body.appendChild(stats.dom);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setAnimationLoop(animate);
renderer.setPixelRatio(devicePixelRatio);

// Habilita sombras
renderer.shadowMap.enabled = true;

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
camera.position.z = 5;

// Movimento da câmera
controls.enablePan = true;

// Rotação da câmera
controls.enableRotate = true;

// Zoom da câmera
controls.enableZoom = true;
controls.maxDistance = 20;
controls.minDistance = 5;

// Suavização do movimento da câmera
controls.enableDamping = true;
controls.dampingFactor = 0.1;

controls.update();

const world = new World(10, 10);
scene.add(world);

// Cria a configuração do mundo com base nas dimensões atuais
const worldConfig = new WorldConfig({
	width: world.width,
	height: world.height,
});

// Adiciona Jogador 1 na posição (1, 0.5, 1)
const player1 = new HumanPlayer(new THREE.Vector3(1, 0.5, 1), camera, world);
player1.name = "Player 1";
player1.castShadow = true; // Jogador projeta sombra
scene.add(player1);

// Adiciona Jogador 2 na posição (8, 0.5, 8)
const player2 = new HumanPlayer(new THREE.Vector3(8, 0.5, 8), camera, world);
player2.name = "Player 2";
player2.castShadow = true; // Jogador projeta sombra
scene.add(player2);

const combatManager = new CombatManager();
combatManager.addPlayer(player1);
combatManager.addPlayer(player2);

// Sistema de ambiente com a configuração do mundo
const environmentManager = new EnvironmentManager(scene, { worldConfig });

// Adiciona luz solar - não precisa mais chamar setWorldDimensions
environmentManager.lightingManager.createLight("sun", "sun", {
	showHelper: true,
	intensity: 2,
	dayDuration: 60,
});

// Adiciona luz da lua
environmentManager.lightingManager.createLight("moon", "moon", {
	showHelper: true,
	intensity: 2,
});

// Adiciona luz ambiente
environmentManager.lightingManager.createLight("ambient", "ambient", {
	intensity: 0.5,
});

// Configurar névoa básica
environmentManager.atmosphereManager.setFog({
	color: 0xcccccc,
	density: 0.02,
	type: "exp",
});

// Variável para rastrear o tempo para animação
let lastTime = 0;

// Referencias aos elementos da UI do tempo
const worldTimeElement = document.getElementById("world-time");
const worldSeasonElement = document.getElementById("world-season");

function animate(time) {
	const deltaTime = lastTime === 0 ? 0 : (time - lastTime) / 1000;
	lastTime = time;

	// Atualiza o sistema de ambiente completo
	environmentManager.update(deltaTime);

	// Atualiza os elementos da UI com o horário do mundo
	if (worldTimeElement) {
		worldTimeElement.textContent =
			environmentManager.getFormattedWorldTime();
	}

	if (worldSeasonElement) {
		worldSeasonElement.textContent =
			environmentManager.getCurrentSeasonName();
	}

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
worldFolder
	.add(world, "width", 1, 20, 1)
	.name("Width")
	.onChange((value) =>
		environmentManager.updateWorldDimensions(value, world.height)
	);

worldFolder
	.add(world, "height", 1, 20, 1)
	.name("Height")
	.onChange((value) =>
		environmentManager.updateWorldDimensions(world.width, value)
	);

worldFolder.addColor(world.terrain.material, "color").name("Color");
worldFolder.add(world, "treeCount", 1, 100, 1).name("Tree Count");
worldFolder.add(world, "rockCount", 1, 100, 1).name("Rock Count");
worldFolder.add(world, "bushCount", 1, 100, 1).name("Bush Count");
worldFolder.add(world, "textureWired").name("Texture Wired");
worldFolder.add(world, "showPathDebug").name("Show Path Debug");
worldFolder.add(world.terrain.material, "wireframe").name("Wireframe");
worldFolder.add(world, "generate").name("Generate");
setupEnvironmentGUI(gui, environmentManager);

combatManager.takeTurns();
