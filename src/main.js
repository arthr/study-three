// Importa a biblioteca THREE.js
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import Stats from "three/addons/libs/stats.module.js";
import GUI from "lil-gui";
import { Terrain } from "./terrain";

const gui = new GUI();

// Cria um objeto de estatísticas para medir o desempenho
const stats = new Stats();
stats.showPanel(0);
document.body.appendChild(stats.dom);

// Cria o renderizador WebGL e define seu tamanho para o tamanho da janela
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);

// Define a função de animação para ser chamada em cada quadro
renderer.setAnimationLoop(animate);

// Adiciona o elemento DOM do renderizador ao corpo do documento
document.body.appendChild(renderer.domElement);

// Cria uma nova cena
const scene = new THREE.Scene();

// Configura a câmera com campo de visão de 75 graus, proporção da tela, e planos de corte
const camera = new THREE.PerspectiveCamera(
	75,
	window.innerWidth / window.innerHeight,
	0.1,
	1000
);
camera.position.set(10, 2, 10);

// Adiciona controles de órbita à câmera
const controls = new OrbitControls(camera, renderer.domElement);

// Adiciona um terreno à cena
const terrain = new Terrain(10, 10, 10);
scene.add(terrain);

// Cria uma luz direcional branca
const sun = new THREE.DirectionalLight(0xffffff, 1);
sun.position.set(1, 2, 3);
sun.intensity = 2;
scene.add(sun);

// Cria uma luz ambiente branca
const ambient = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambient);

// Define a posição da câmera no eixo Z
camera.position.z = 5;

// Atualiza os controles de órbita
controls.update();

// Função de animação que será chamada em cada quadro
function animate() {
	// Atualiza os controles de órbita
	controls.update();

	// Renderiza a cena a partir da perspectiva da câmera
	renderer.render(scene, camera);

	// Atualiza as estatísticas
	stats.update();
}

// Adiciona um ouvinte de evento para redimensionar a janela
window.addEventListener("resize", () => {
	// Atualiza a câmera e o renderizador quando a janela é redimensionada
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
});

const terrainFolder = gui.addFolder("Terrain");
terrainFolder.add(terrain, "width", 1, 20, 1).name("Width");
terrainFolder.add(terrain, "height", 1, 20, 1).name("Height");
terrainFolder.addColor(terrain.terrain.material, "color").name("Color");
terrainFolder.add(terrain.material, "wireframe").name("Wireframe");
terrainFolder.onChange(() => {
	terrain.createTerrain();
});
