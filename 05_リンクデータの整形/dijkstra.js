/**
 * 
 * @param {Array<{id: number, startNodeId: number, endNodeId: number, distance: number}>} linksWithDistances リンクコストを格納した配列
 * @param {number} numberOfNodes ノードの個数
 * @param {number} startPoint 始点ノードのID
 * @returns {{distances: Array<number>, nextPointOnRoute: Array<number>}}
 */
module.exports = function (linksWithDistances, numberOfNodes, startPoint) {

	// 各点が訪問済みかどうかを示す配列
	const visited = Array(numberOfNodes).fill(false, 0);

	// スタート地点からの距離を格納する配列
	const distances = Array(numberOfNodes).fill(Infinity, 0);

	// スタート地点までの経路を辿るとき、１個先の点を記憶する配列
	const nextPointOnRoute = Array(numberOfNodes).fill(-1, 0);

	// スタート地点の距離を0に設定する
	distances[startPoint] = 0;

	// 現在地を設定する
	let currentPoint = startPoint;

	// 最短コストを探索する
	while (currentPoint != undefined) {

		// 現在地を訪問済みにする
		visited[currentPoint] = true;

		// 現在地に隣接する各点の最短距離を更新
		for (let i = 0; i < linksWithDistances.length; i++) {

			let neighborPoint;
			let link = linksWithDistances[i]

			if (link.startNodeId == currentPoint) {
				neighborPoint = link.endNodeId;
			} else if (link.endNodeId == currentPoint) {
				neighborPoint = link.startNodeId;
			} else {
				continue;
			}

			let newDistance = distances[currentPoint] + link.distance;

			if (newDistance < distances[neighborPoint]) {
				distances[neighborPoint] = newDistance;
				nextPointOnRoute[neighborPoint] = currentPoint;
			}

		}

		// 次に訪問する点を決める
		let nextPoint;
		let nearsetNeighborDistance = Infinity;

		for (let i = 0; i < linksWithDistances.length; i++) {
			if (!visited[i] && distances[i] < nearsetNeighborDistance) {
				nextPoint = i;
				nearsetNeighborDistance = distances[i];
			}
		}

		currentPoint = nextPoint;
	}

	return {
		distances: distances,
		nextPointOnRoute: nextPointOnRoute
	};

};
