import * as THREE from "three";

export class RainEffect {
	/**
	 * @param {THREE.Scene} scene A cena para aplicar o efeito de chuva
	 * @param {object} options Opções para a chuva
	 */
	constructor(scene, options = {}) {
		this.scene = scene;
		this.active = false;
		this.rainGroup = new THREE.Group();

		const {
			count = 1000,
			size = 0.1,
			area = { width: 30, height: 20, depth: 30 },
			velocity = 10,
			opacity = 0.6,
			color = 0x88ccff,
		} = options;

		this.options = { count, size, area, velocity, opacity, color };
		this.raindrops = [];
	}

	/**
	 * Cria o sistema de partículas para a chuva
	 */
	createRainParticles() {
		const { count, size, area, opacity, color } = this.options;

		// Material para as gotas de chuva
		const material = new THREE.MeshBasicMaterial({
			color,
			transparent: true,
			opacity,
		});

		// Geometria para cada gota (linha vertical)
		const geometry = new THREE.CylinderGeometry(0.01, 0.01, size, 3);
		geometry.rotateX(Math.PI / 2); // Alinhar verticalmente

		// Cria as gotas de chuva
		for (let i = 0; i < count; i++) {
			const raindrop = new THREE.Mesh(geometry, material);

			// Posição aleatória dentro da área
			raindrop.position.set(
				(Math.random() - 0.5) * area.width,
				Math.random() * area.height,
				(Math.random() - 0.5) * area.depth
			);

			// Adiciona a gota ao grupo
			this.rainGroup.add(raindrop);
			this.raindrops.push(raindrop);
		}

		// Adiciona o grupo à cena
		this.scene.add(this.rainGroup);
	}

	/**
	 * Inicia o efeito de chuva
	 */
	start() {
		if (!this.active) {
			this.active = true;
			this.createRainParticles();
		}
	}

	/**
	 * Para o efeito de chuva
	 */
	stop() {
		if (this.active) {
			this.active = false;
			this.scene.remove(this.rainGroup);
			this.rainGroup = new THREE.Group();
			this.raindrops = [];
		}
	}

	/**
	 * Atualiza a posição das gotas de chuva
	 * @param {number} deltaTime Tempo desde o último frame
	 */
	update(deltaTime) {
		if (!this.active) return;

		const { velocity, area } = this.options;

		this.raindrops.forEach((drop) => {
			// Move a gota para baixo
			drop.position.y -= velocity * deltaTime;

			// Se a gota sair da área, reposiciona no topo
			if (drop.position.y < 0) {
				drop.position.y = area.height;
				drop.position.x = (Math.random() - 0.5) * area.width;
				drop.position.z = (Math.random() - 0.5) * area.depth;
			}
		});
	}
}
