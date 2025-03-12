import * as THREE from "three";
import { World } from "./world";
import { getKey } from "./utils";

/**
 * Finds the shortest path between two points (if one exists)
 * @param {THREE.Vector3} start
 * @param {THREE.Vector3} end
 * @param {World} world
 * @return {THREE.Vector3[] | null } If path is found, returns an array of
 * coordinates that make up the path. Otherwise, returns null.
 */
export function search(start, end, world) {
	// If the end is equal to the start, skip searching
	if (start.equals(end)) return [];

	console.log(`Searching from ${start.x}, ${start.z} to ${end.x}, ${end.z}`);

	let pathFound = false;
	const maxSearchDistance = 50;

	const cameFrom = new Map();
	const cost = new Map();
	const frontier = [start];

	cost.set(getKey(start), 0);

	let counter = 0;
	while (frontier.length > 0) {
		// Get the square with the shortest distance metric
		// Dijkstra's algorithm - distance to origin
		// A* algorithm - distance to origin + estimated distance to destination
		frontier.sort((v1, v2) => {
			const g1 = start.manhattanDistanceTo(v1);
			const g2 = start.manhattanDistanceTo(v2);
			const h1 = v1.manhattanDistanceTo(end);
			const h2 = v2.manhattanDistanceTo(end);
			const f1 = g1 + h1;
			const f2 = g2 + h2;
			return f1 - f2;
		});

		const candidate = frontier.shift();

		counter++;

		// If the candidate is the end, we're done
		if (candidate.equals(end)) {
			console.log(`Path found in ${counter} iterations`);
			pathFound = true;
			break;
		}

		// If we have exceeded the maximum search distance, skip to the next candidate
		if (candidate.manhattanDistanceTo(start) > maxSearchDistance) {
			continue;
		}

		// Search the neighbors of the square
		const neighbors = getNeighbors(candidate, world, cost);
		frontier.push(...neighbors);

		// Mark wich square each neighbor came from
		neighbors.forEach((neighbor) => {
			cameFrom.set(getKey(neighbor), candidate);
		});
	}

	if (!pathFound) return null;

	// Reconstruct the path
	let curr = end;
	const path = [curr];

	while (getKey(curr) !== getKey(start)) {
		const prev = cameFrom.get(getKey(curr));
		path.push(prev);
		curr = prev;
	}

	path.reverse();

	return path;
}

/**
 * Returns array of neighboring squares coordinates
 * @param {THREE.Vector3} coords
 * @param {World} world
 * @param {Map} cost
 * @returns {THREE.Vector3[]}
 */
export function getNeighbors(coords, world, cost) {
	let neighbors = [];
	// Left
	if (coords.x > 0) {
		neighbors.push(new THREE.Vector3(coords.x - 1, 0, coords.z));
	}

	// Right
	if (coords.x < world.width - 1) {
		neighbors.push(new THREE.Vector3(coords.x + 1, 0, coords.z));
	}

	// Top
	if (coords.z > 0) {
		neighbors.push(new THREE.Vector3(coords.x, 0, coords.z - 1));
	}

	// Bottom
	if (coords.z < world.height - 1) {
		neighbors.push(new THREE.Vector3(coords.x, 0, coords.z + 1));
	}

	// Cost to get to neighbor is 1 more than the current square
	const newCost = cost.get(getKey(coords)) + 1;

	// Filter out neighbors that are already in the cost map or have an object
	// on them (e.g. trees, rocks, bushes)
	neighbors = neighbors.filter((coords) => {
		const key = getKey(coords);
		if (
			(!cost.has(key) || newCost < cost.get(key)) &&
			!world.getObject(coords)
		) {
			cost.set(key, newCost);
			return true;
		}
		return false;
	});

	return neighbors;
}
