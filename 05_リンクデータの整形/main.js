const fs = require("fs");
const calculateDistance = require("./links").calculateDistance;
const createLinksFromNodes = require("./links").createLinksFromNodes;
const loadCSV = require("./loadCSV").loadCSV;
const dijkstra = require("./dijkstra");

const links = loadCSV("links-with-width.csv", 0);
const nodes = loadCSV("nodes.csv", 0);

// QGISで表示するため、linkをCSV形式で可視化した links_wkt.csv を作成
const WKTlist = links.map((link) => {
	return [link[0], link[1], link[2], link[3], `"LINESTRING(${nodes[link[1]][1]} ${nodes[link[1]][2]}, ${nodes[link[2]][1]} ${nodes[link[2]][2]})"`];
});
fs.writeFileSync(`links-with-width-wkt.csv`, WKTlist.map((row) => row.join(",")).join("\n"));

// 繋がっていないリンクがないかチェックする
const linksWithDistances = calculateDistance(nodes, links); // 距離を計算
const routes = [];
for (let i = 0; i < nodes.length; i++) {
	routes.push(dijkstra(linksWithDistances, nodes.length, i).nextPointOnRoute);
}
for (let startNodeId = 0; startNodeId < nodes.length; startNodeId++) {
	for (let endNodeId = startNodeId + 1; endNodeId < nodes.length; endNodeId++) {
		if (routes[endNodeId][startNodeId] == -1) {
			console.log(`Node ${startNodeId} and ${endNodeId} are not connected.`);
		}
	}
}