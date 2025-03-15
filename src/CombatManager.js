import { Player } from "./players/Player";

export class CombatManager {
	/**
	 * @type {Player[]}
	 */
	players = [];

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
				do {
					const action = await player.requestAction();
					if (action.canPerform()) {
						await action.perform();
						actionPerformed = true;
					} else {
						console.log("Action cannot be performed");
					}
				} while (!actionPerformed);
			}
		}
	}

	removePlayer() {}
}
