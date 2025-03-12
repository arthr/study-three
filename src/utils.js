/**
 * Returns a key for for the object map given the coordinates.
 * @param {THREE.Vector3} coords
 * @returns
 */
export function getKey(coords) {
	return `${coords.x}-${coords.y}-${coords.z}`;
}
