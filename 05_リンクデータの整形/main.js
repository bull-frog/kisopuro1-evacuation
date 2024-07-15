const fs = require("fs");
const calculateDistance = require("./links").calculateDistance;
const createLinksFromNodes = require("./links").createLinksFromNodes;
const loadCSV = require("./loadCSV").loadCSV;

const links = loadCSV("links.csv", 0);
const nodes = loadCSV("nodes.csv", 0);

// QGISで表示するため、linkをCSV形式で可視化した links_wkt.csv を作成
const WKTlist = links.map((link) => {
	return [link[0], link[1], link[2], `"LINESTRING(${nodes[link[1]][1]} ${nodes[link[1]][2]}, ${nodes[link[2]][1]} ${nodes[link[2]][2]})"`];
});
fs.writeFileSync(`links_wkt.csv`, WKTlist.map((row) => row.join(",")).join("\n"));