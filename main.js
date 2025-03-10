// Importa a biblioteca THREE.js
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import Stats from "three/addons/libs/stats.module.js";
import GUI from "lil-gui";

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

// Adiciona controles de órbita à câmera
const controls = new OrbitControls(camera, renderer.domElement);

// Cria uma luz direcional branca
const sun = new THREE.DirectionalLight(0xffffff, 1);
sun.position.set(1, 2, 3);
scene.add(sun);

// Cria uma luz ambiente branca
const ambient = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambient);

// Cria a geometria de um cubo
const geometry = new THREE.BoxGeometry(1);

// Cria um material básico de malha com a cor verde
const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });

// Cria uma malha combinando a geometria e o material
const cube = new THREE.Mesh(geometry, material);

// Adiciona o cubo à cena
scene.add(cube);

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

const folder = gui.addFolder("Cube");
folder.add(cube.position, "x", -2, 2).name("Position X");
folder.addColor(material, "color").name("Color");
folder.add(material, "wireframe").name("Wireframe");
folder.open();
