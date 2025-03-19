import { Player } from "./players/Player";
import * as THREE from "three";

export class CombatManager {
	/**
	 * @type {Player[]}
	 */
	players = [];

	/**
	 * Armazena os materiais originais dos jogadores
	 * @type {Map<Player, THREE.Material>}
	 */
	originalMaterials = new Map();

	constructor() {
		this.actions = [];
	}

	/**
	 * Get players initiative and add them to the
	 * array of players
	 * @param {Player} player
	 */
	addPlayer(player) {
		this.players.push(player);
	}

	/**
	 * Main combat loop
	 */
	async takeTurns() {
		while (true) {
			for (const player of this.players) {
				let actionPerformed = false;

				// highlight the player
				player.highlight();
				do {
					const action = await player.requestAction();
					if (await action.canPerform()) {
						// Wait for the player to finish their action
						await action.perform();
						actionPerformed = true;
					} else {
						console.log("Action cannot be performed");
					}
				} while (!actionPerformed);

				// unhighlight the player
				player.unhighlight();
			}
		}
	}

	removePlayer() {}
}
