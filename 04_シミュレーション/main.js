const { loadCSVWithSpecifiedFilename } = require("./loadCSV");

const calculateDistance = require("./links").calculateDistance;
const createLinksFromNodes = require("./links").createLinksFromNodes;
const loadCSV = require("./loadCSV").loadCSV;
const dijkstra = require("./dijkstra").dijkstra;
const Agent = require("./agent").Agent;
const generateAgents = require("./agent").generateAgents;
const Street = require("./street");

const timeInterval = 10; // シミュレーションの時間間隔 (s)


// ノード・リンクのデータを読み込み、前処理を行う

/**
 * @typedef {[id: number, startId: number, endId: number, width: number, wkt: string]} Link
 * @type {Array<Link>}
 */
const links = loadCSV("links-with-width-wkt.csv", 0);

/**
 * @typedef {[id: number, lon: number, lat: number]} Node
 * @type {Array<Node>}
 */
const nodes = loadCSV("nodes.csv", 0);

/**
 * リンクの距離情報を持つオブジェクトの配列
 * @type {Array<{id: number, startNodeId: number, endNodeId: number, distance: number, width: number}>}
 */
const linksWithDistances = calculateDistance(nodes, links); // 距離を計算

/**
 * そのノードから出るリンクのID、行き先、方向を持ったオブジェクトの配列
 * @type {Array<Array<{linkId: number, destination: number, up: boolean}>>}
 */
const linksFromNodes = createLinksFromNodes(nodes, links);

/**
 * 各始点から全ての点への経路上の次の点を格納した二次元配列。
 * routes[目的地][現在地]で、現在地から目的地へ行く最短経路上の次の点が得られる。
 * 目的地 = 現在地の場合には、-1が格納される。
 * @type {Array<Array<number>>}
 */
const routes = [];
for (let i = 0; i < nodes.length; i++) {
	routes.push(dijkstra(linksWithDistances, nodes.length, i).nextPointOnRoute);
}

// エージェントの初期化
let agents = generateAgents(linksWithDistances, routes);

// 状態変数の定義
let streetSituations = Street.updateAgentsInStreets(agents, linksWithDistances);
let agentsInStreets = streetSituations.agentsInStreets;
let populationDensityInStreets = streetSituations.populationDensityInStreets;
let peopleMovingStatusInStreets = streetSituations.peopleMovingStatusInStreets;
let nodeSituations = Street.updateAgentsInNodes(agents, nodes);
let agentsInNodes = nodeSituations.agentsInNodes;
let totalPopulationInNodes = nodeSituations.totalPopulationInNodes;
let peopleMovingStatusInNodes = nodeSituations.peopleMovingStatusInNodes;
let nodeIsStacked = nodeSituations.nodeIsStacked;



// シミュレーションの記録を格納する配列などはここで初期化すべし



// タイムステップの実行
for (let t = 0; t < 200; t++) {

	// 時刻を表示
	console.log(`~~~ 避難開始から ${(t * timeInterval / 60).toFixed(1)} 分 ~~~`);

	// エージェントを動かす
	agents.forEach(agent => agent.timestep(routes, linksWithDistances, linksFromNodes, peopleMovingStatusInStreets, populationDensityInStreets, peopleMovingStatusInNodes, nodeIsStacked));

	// 状態変数を更新
	streetSituations = Street.updateAgentsInStreets(agents, linksWithDistances);
	agentsInStreets = streetSituations.agentsInStreets;
	populationDensityInStreets = streetSituations.populationDensityInStreets;
	peopleMovingStatusInStreets = streetSituations.peopleMovingStatusInStreets;
	nodeSituations = Street.updateAgentsInNodes(agents, nodes);
	agentsInNodes = nodeSituations.agentsInNodes;
	totalPopulationInNodes = nodeSituations.totalPopulationInNodes;
	peopleMovingStatusInNodes = nodeSituations.peopleMovingStatusInNodes;
	nodeIsStacked = nodeSituations.nodeIsStacked;

	// いくつかのエージェントの情報を表示
	[0, 5000, 10000, 15000, 20000, 25000, 30000, 35000, 40000, 45000].forEach(i => {
		const agent = agents[i];
		console.log(`Agent${i} is at ${agent.currentStreetNumber != -1 ? "link" + agent.currentStreetNumber : "node" + agent.currentNodeNumber} and is ${agent.isStacked ? "stacked" : "moving to node" + agent.nextNodeNumber}`);
	});

	// シミュレーションの記録を格納すべし
	

}