const { loadCSVWithSpecifiedFilename } = require("./loadCSV");

const calculateDistance = require("./links").calculateDistance;
const createLinksFromNodes = require("./links").createLinksFromNodes;
const loadCSV = require("./loadCSV").loadCSV;
const dijkstra = require("./dijkstra").dijkstra;
const Agent = require("./agent").Agent;
const generateAgents = require("./agent").generateAgents;
const Street = require("./street");


// ノード・リンクのデータを読み込み、前処理を行う

/**
 * @typedef {[id: number, startId: number, endId: number, width: number]} Link
 * @type {Array<Link>}
 */
const links = loadCSV("links-with-width.csv", 0);

/**
 * @typedef {[id: number, lon: number, lat: number]} Node
 * @type {Array<Node}
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
let agents = [];
generateAgents(agents, linksWithDistances, routes);