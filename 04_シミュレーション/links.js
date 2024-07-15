/**
 * リンクの長さを計算し返す
 * @typedef {[id: number, lon: number, lat: number]} Node
 * @typedef {[id: number, startId: number, endId: number]} Link
 * @param {Array<Node>} nodes - ノードの配列
 * @param {Array<Link>} links - リンクの配列
 * @returns {Array<{id: number, startNodeId: number, endNodeId: number, distance: number}>} - リンクの情報を持つオブジェクトの配列
 */
exports.calculateDistance = function (nodes, links) {
	return links.map((link) => {
		return {
			id: link[0],
			startNodeId: link[1],
			endNodeId: link[2],
			distance: getDistanceBetweenNodes(nodes[link[1]], nodes[link[2]])
		}
	});
};

/**
 * ノードごとに、そのノードから伸びているリンクの情報を持つ配列を作成
 * @typedef {[id: number, lon: number, lat: number]} Node
 * @typedef {[id: number, startId: number, endId: number]} Link
 * @param {Array<Node>} nodes - ノードの配列
 * @param {Array<Link>} links - リンクの配列
 * @returns {Array<Array<{linkId: number, destination: number, up: boolean}>>} - ノードごとのリンク情報を持つ配列
 */
exports.createLinksFromNodes = function (nodes, links) {
	const linksFromNodes = new Array(nodes.length).fill(null).map(() => []);
	links.forEach((link, index) => {
		linksFromNodes[link[1]].push({ linkId: index, destination: link[2], up: false });
		linksFromNodes[link[2]].push({ linkId: index, destination: link[1], up: true });
	});
	return linksFromNodes;
}

/**
 * 2地点間の距離 (m) を計算する関数。
 * @param {Node} node1 - 点1 [id, lon, lat]
 * @param {Node} node2 - 点2 [id, lon, lat]
 * @returns {number} - 2地点間の距離 (m)
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
 * @param {number} deg - 角度 (度)
 * @returns {number} - ラジアン
 */
function degToRad(deg) {
	return deg * (Math.PI / 180);
}