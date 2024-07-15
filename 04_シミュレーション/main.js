const calculateDistance = require("./links").calculateDistance;
const createLinksFromNodes = require("./links").createLinksFromNodes;
const loadCSV = require("./loadCSV").loadCSV;
const dijkstra = require("./dijkstra").dijkstra;
// const Agent = require("./agent");
// const Street = require("./street");

// ノード・リンクのデータを読み込み、前処理を行う

/**
 * @typedef {[id: number, startId: number, endId: number]} Link
 * @type {Array<Link>}
 */
const links = loadCSV("links.csv", 0);

/**
 * @typedef {[id: number, lon: number, lat: number]} Node
 * @type {Array<Node}
 */
const nodes = loadCSV("nodes.csv", 0);

/**
 * リンクの距離情報を持つオブジェクトの配列
 * @type {Array<{id: number, startNodeId: number, endNodeId: number, distance: number}>}
 */
const linksWithDistances = calculateDistance(nodes, links); // 距離を計算

/**
 * そのノードから出るリンクのID、行き先、方向を持ったオブジェクトの配列
 * @type {Array<Array<{linkId: number, destination: number, up: boolean}>>}
 */
const linksFromNodes = createLinksFromNodes(nodes, links);

// ダイクストラ法で、各始点から全ての点への経路上の次の点を二次元配列に格納。
// nextNode[destination][origin]で、o→dへの次の点が得られる。
// すでに到達している場合は -1
const routes = [];
for (let i = 0; i < nodes.length; i++) {
	routes.push(dijkstra(linksWithDistances, nodes.length, i).nextPointOnRoute);
}

console.log("経路探索完了");


// 点0→100へのルートを表示
let currentPoint = 0;
const goalPoint = 100;
let routeFromStartToGoal = [currentPoint];
while (currentPoint != goalPoint) {
	currentPoint = routes[goalPoint][currentPoint];
	routeFromStartToGoal.push(currentPoint);
}

console.log(routeFromStartToGoal);

