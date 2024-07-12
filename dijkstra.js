//              a,b,c,d,e
const points = [0,1,2,3,4];

// [ [startPoint, endPoint, linkCost] ]の配列
const links = [
	[0,1,7],
	[0,2,4],
	[0,3,3],
	[1,2,1],
	[1,4,2],
	[2,4,6],
	[3,4,5]
];

// 各点が訪問済みかどうかを示す配列
const visited = Array(points.length).fill(false, 0);

// スタート地点からの距離を格納する配列
const distances = Array(points.length).fill(Infinity, 0);

// スタート地点までの経路を辿るとき、１個先の点を記憶する配列
const nextPointOnRoute = Array(points.length).fill(-1, 0);

// スタート地点を設定する
const startPoint = 2;

// スタート地点の距離を0に設定する
distances[startPoint] = 0;

// 現在地を設定する
let currentPoint = startPoint;

// 最短コストを探索する
while (currentPoint != undefined) {

	// console.log("~~~~~~~~~~~");
	// console.log(`current point: ${currentPoint}`);

	// 現在地を訪問済みにする
	visited[currentPoint] = true;

	// 現在地に隣接する各点の最短距離を更新
	for (let i = 0; i < links.length; i++) {

		let neighborPoint;
		let link = links[i]

		if (link[0] == currentPoint) {
			neighborPoint = link[1];
		} else if (link[1] == currentPoint) {
			neighborPoint = link[0];
		} else {
			continue;
		}

		let newDistance = distances[currentPoint] + link[2];

		if (newDistance < distances[neighborPoint]) {
			// console.log(`new distance of point ${neighborPoint} is ${newDistance}`);
			distances[neighborPoint] = newDistance;
			nextPointOnRoute[neighborPoint] = currentPoint;
		}

	}

	// 次に訪問する点を決める
	let nextPoint;
	let nearsetNeighborDistance = Infinity;

	for (let i = 0; i < links.length; i++) {
		if (!visited[i] && distances[i] < nearsetNeighborDistance) {
			nextPoint = i;
			nearsetNeighborDistance = distances[i];
		}
	}

	currentPoint = nextPoint;
}

// 結果を表示する
console.log(`点${startPoint}からの距離`, distances);
console.log("どこから来たか", nextPointOnRoute);