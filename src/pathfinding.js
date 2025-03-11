import * as THREE from "three";
import { World } from "./world";

const getKeys = (coords) => `${coords.x}-${coords.y}`;

/**
 * Finds the shortest path between two points (if one exists)
 * @param {THREE.Vector2} start
 * @param {THREE.Vector2} end
 * @param {World} world
 * @return {THREE.Vector2[]} Return an array of coordinates that represent the path
 */
export function search(start, end, world) {
	// If the end is equal to the start, skip searching
	if (start.x === end.x && start.y === end.y) return [];

    console.log(`Searching from ${start.x}, ${start.y} to ${end.x}, ${end.y}`);
	const maxSearchDistance = 20;
	const visited = new Set();
	const frontier = [start];

	while (frontier.length > 0) {
		// Get the square with the shortest distance metric
		// Dijkstra's algorithm - distance to origin
		// A* algorithm - distance to origin + estimated distance to destination
		frontier.sort((v1, v2) => {
			const d1 = start.manhattanDistanceTo(v1);
			const d2 = start.manhattanDistanceTo(v2);
			return d1 - d2;
		});

		const candidate = frontier.shift();
		console.log(candidate);

		// If the candidate is the end, we're done
		if (candidate.x === end.x && candidate.y === end.y) {
			console.log("Found the end");
			break;
		}

		// Mark the square as visited
		visited.add(getKeys(candidate));

		// If we have exceeded the maximum search distance, skip to the next candidate
		if (candidate.manhattanDistanceTo(start) > maxSearchDistance) {
			continue;
		}

		// Search the neighbors of the square
		const neighbors = getNeighbors(candidate, world, visited);
		frontier.push(...neighbors);
	}
}

/**
 * Returns array of neighboring squares coordinates
 * @param {THREE.Vector2} coords
 * @param {World} world
 * @param {Set<string>} visited
 * @returns {THREE.Vector2[]}
 */
export function getNeighbors(coords, world, visited) {
	let neighbors = [];
	// Left
	if (coords.x > 0) {
		neighbors.push(new THREE.Vector2(coords.x - 1, coords.y));
	}

	// Right
	if (coords.x < world.width - 1) {
		neighbors.push(new THREE.Vector2(coords.x + 1, coords.y));
	}

	// Top
	if (coords.y > 0) {
		neighbors.push(new THREE.Vector2(coords.x, coords.y - 1));
	}

	// Bottom
	if (coords.y < world.height - 1) {
		neighbors.push(new THREE.Vector2(coords.x, coords.y + 1));
	}

	// Filter out visited squares
	return neighbors.filter((n) => !visited.has(getKeys(n)));
}
