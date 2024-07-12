/**
 * リンクの長さを計算し返す
 * @typedef {[id:number, lon:number, lat:number]} Node
 * @typedef {[startId:number, endId:number]} Link
 * @param {Array<Node>} nodes 
 * @param {Array<Link} links
 * @returns [[startId, endId, length]]
 */
exports.calculateDistance = function (nodes, links) {
	return links.map((link) => [link[0], link[1], getDistanceBetweenNodes(nodes[link[0]], nodes[link[1]])]);
};


/**
 * 2地点間の距離 (m) を計算する関数。AIに聞いた。
 *
 * @param {Node} node1 点1 [id, lon, lat]
 * @param {Node} node2 点2 [id, lon, lat]
 * @returns {number} 2地点間の距離 (m)
 */
function getDistanceBetweenNodes(node1, node2) {

	const lon1 = node1[1];
	const lon2 = node2[1];
	const lat1 = node1[2];
	const lat2 = node2[2];

	if (lat1 === lat2 && lon1 === lon2) {
		return 0;
	}

	const R = 6371.01; // 地球の半径 (km)
	const dLat = degToRad(lat2 - lat1);
	const dLon = degToRad(lon2 - lon1);

	const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(degToRad(lat1)) * Math.cos(degToRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
	const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

	return R * c * 1000;
}

/**
 * 角度をラジアンに変換する関数。
 *
 * @param {number} deg 角度 (度)
 * @returns {number} ラジアン
 */
function degToRad(deg) {
	return deg * (Math.PI / 180);
}