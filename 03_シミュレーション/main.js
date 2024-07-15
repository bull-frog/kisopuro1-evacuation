const calculateDistance = require("./links").calculateDistance;
const createLinksFromNodes = require("./links").createLinksFromNodes;
const loadCSV = require("./loadCSV").loadCSV;
const dijkstra = require("./dijkstra").dijkstra;
const Agent = require("./agent").Agent;

const links = loadCSV("links.csv", 0);
const nodes = loadCSV("nodes.csv", 0);
const linksWithDistances = calculateDistance(nodes, links);

const linksFromNodes = createLinksFromNodes(nodes, links);
console.log(linksFromNodes);

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