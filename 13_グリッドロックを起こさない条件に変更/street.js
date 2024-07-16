

/**
 * Agentのリストを受け取り、agentsInStreets, populationDensityInStreets, peopleMovingStatusInStreets を更新する
 * @param {Array<Agent>} agents 
 * @param {Array<LinkWithDistance>} linksWithDistances
*/
exports.updateAgentsInStreets = function(agents, linksWithDistances) {

	let agentsInStreets = agents.reduce((acc, agent) => {
		if (!acc[agent.currentStreetNumber]) {
			acc[agent.currentStreetNumber] = [];
		}
		acc[agent.currentStreetNumber].push(agent.id);
		return acc;
	}, linksWithDistances.map(() => []));

	let populationDensityInStreets = agentsInStreets.map((agents, index) => agents.length / linksWithDistances[index].distance / linksWithDistances[index].width);

	let peopleMovingStatusInStreets = agentsInStreets.map((agentIds, index) => {
		const upperNode = linksWithDistances[index].startNodeId;
		const lowerNode = linksWithDistances[index].endNodeId;
		const upperNodePopulation = agentIds.filter(agentId => agents[agentId].nextNodeNumber === upperNode && !agents[agentId].isStacked).length;
		const lowerNodePopulation = agentIds.filter(agentId => agents[agentId].nextNodeNumber === lowerNode && !agents[agentId].isStacked).length;
		const stoppingPopulation = agentIds.length - upperNodePopulation - lowerNodePopulation;
		return { up: upperNodePopulation / agentIds.length, down: lowerNodePopulation / agentIds.length, stopping: stoppingPopulation / agentIds.length };
	});

	return {
		agentsInStreets: agentsInStreets,
		populationDensityInStreets: populationDensityInStreets,
		peopleMovingStatusInStreets: peopleMovingStatusInStreets
	};

}


/**
 * Agentのリストを受け取り、agentsInNodes, totalPopulationInNodes, peopleMovingStatusInNodes, nodeIsStacked を更新する
 * @param {Array<Agent>} agents 
 * @param {Array<LinkWithDistance>} linksWithDistances
*/
exports.updateAgentsInNodes = function(agents, nodes) {

	let agentsInNodes = agents.reduce((acc, agent) => {
		if (!acc[agent.currentNodeNumber]) {
			acc[agent.currentNodeNumber] = [];
		}
		acc[agent.currentNodeNumber].push(agent.id);
		return acc;
	}, nodes.map(() => []));

	let totalPopulationInNodes = agentsInNodes.map(agents => agents.length);

	let peopleMovingStatusInNodes = agentsInNodes.map((agentIds, index) => {
		const nextNodes = agentIds.map(agentId => agents[agentId].nextNodeNumber);
		const nextNodeCounts = nextNodes.reduce((acc, nextNode) => {
			if (acc[nextNode] === undefined) {
				acc[nextNode] = 1;
			} else {
				acc[nextNode]++;
			}
			return acc;
		}, {});
		return Object.entries(nextNodeCounts).map(([to, count]) => ({ to: Number(to), ratio: count / agentIds.length }));
	});

	// isStackedプロパティがtrueであるエージェントが存在するnodeをtrue,そうでないnodeをfalseとする
	let nodeIsStacked = agentsInNodes.map(agentIds => agentIds.some(agentId => agents[agentId].isStacked));

	return {
		agentsInNodes: agentsInNodes,
		totalPopulationInNodes: totalPopulationInNodes,
		peopleMovingStatusInNodes: peopleMovingStatusInNodes,
		nodeIsStacked: nodeIsStacked
	};
}