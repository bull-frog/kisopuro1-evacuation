const calculateDistance = require("./calculateDistance");
const loadCSV = require("./loadCSV");
const dijkstra = require("./dijkstra");

const links = loadCSV.loadCSV("links.csv", 0);
const nodes = loadCSV.loadCSV("nodes.csv", 0);
console.log(links);
const linksWithDistances = calculateDistance.calculateDistance(nodes, links);

// 点0から各点への距離、点1から各点へ行く際に次に向かう点を表示
const dijkstraResult = dijkstra.dijkstra(links, nodes.length, 0);
console.log(dijkstraResult.distances);
console.log(dijkstraResult.nextPointOnRoute);