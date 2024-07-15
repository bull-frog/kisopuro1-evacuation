const calculateDistance = require("./links").calculateDistance;
const createLinksFromNodes = require("./links").createLinksFromNodes;
const loadCSV = require("./loadCSV").loadCSV;
const dijkstra = require("./dijkstra").dijkstra;
const Agent = require("./agent");
const Street = require("./street");

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

// console.log("経路探索完了");


// // 点0→100へのルートを表示
// let currentPoint = 0;
// const goalPoint = 100;
// let routeFromStartToGoal = [currentPoint];
// while (currentPoint != goalPoint) {
// 	currentPoint = routes[goalPoint][currentPoint];
// 	routeFromStartToGoal.push(currentPoint);
// }

// console.log(routeFromStartToGoal);


// Agentsのリスト
let agents = [];

/**
 * 道にいるエージェントのidのリスト
 * [[agentId, agentId, ...], ...]
 */
let agentsInStreets;

/**
 * 道の人口密度（人/㎡）
 * @type Array<number>
 */
let populationDensityInStreets;

/**
 * それぞれの道で、方向別に通行している人、止まっている人の割合のリスト
 * 数の小さい交差点→大きい交差点が down, 大きい交差点→小さい交差点が up
 * [{up: number, down: number, stopping: number}, ...]
 */
let peopleMovingStatusInStreets;

/**
 * 交差点にいるエージェントのidのリスト
 * [[agentId, agentId, ...], ...]
 */
let agentsInNodes;

/**
 * 交差点にいる人数
 * @type Array<number>
 */
let totalPopulationInNodes;

/**
 * それぞれの交差点にいる人が、次に向かおうとしている交差点の割合のリスト
 * [[{to: number, ratio: number}, ...], ...]
 */
let peopleMovingStatusInNodes;


// エージェントを新規作成
for (let i = 0; i < 50000; i++) {
	agents.push(new Agent(i, 30, 70, 0.5, 130, 2, routes, linksWithDistances));
}

for (let i = 0; i < 100; i++) {
	// エージェントの移動
	agents.forEach(agent => {
		agent.timestep(routes, linksWithDistances, linksFromNodes);
	});

	// エージェントの位置情報を更新
	agentsInStreets, populationDensityInStreets, peopleMovingStatusInStreets = Street.updateAgentsInStreets(agents, linksWithDistances);
	agentsInNodes, totalPopulationInNodes, peopleMovingStatusInNodes = Street.updateAgentsInNodes(agents, nodes);

	// エージェントの位置情報を表示
	let statusOfAgent0 = agents[0].getStatus();
	console.log(`Time: ${(i * 10 / 60).toFixed(1)}分`);
	console.log(`Agent 0 is at ${statusOfAgent0.currentStreetNumber == -1 ? "node" + statusOfAgent0.currentNodeNumber : "street" + statusOfAgent0.currentStreetNumber} and is going to ${statusOfAgent0.nextNodeNumber == -1 ? "nowhere" : "node" + statusOfAgent0.nextNodeNumber}`);

	// 道の情報を表示
	// console.log(`Population density in streets: ${populationDensityInStreets}`);
	// console.log(`People moving status in streets: ${peopleMovingStatusInStreets}`);

}