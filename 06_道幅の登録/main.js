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

// 2地点の距離を求める
const node1 = [0, 139.694, 35.66];
const node2 = [1, 139.702, 35.66];

console.log(getDistanceBetweenNodes(node1, node2));