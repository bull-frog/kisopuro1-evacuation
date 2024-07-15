/**
 * 道にいるエージェントのidのリスト
 * [[agentId, agentId, ...], ...]
 */
let agentsInStreets = [];

/**
 * 道の人口密度（人/㎡）
 * @type Array<number>
 */
let populationDensityInStreets = [];

/**
 * それぞれの道で、方向別に通行している人、止まっている人の割合のリスト
 * 数の小さい交差点→大きい交差点が down, 大きい交差点→小さい交差点が up
 * [{up: number, down: number, stopping: number}, ...]
 */
let peopleMovingStatusInStreets = [];

/**
 * 交差点にいるエージェントのidのリスト
 * [[agentId, agentId, ...], ...]
 */
let agentsInNodes = [];

/**
 * 交差点にいる人数
 * @type Array<number>
 */
let totalPopulationInNodes = [];

/**
 * それぞれの交差点にいる人が、次に向かおうとしている交差点の割合のリスト
 * [[{to: number, ratio: number}, ...], ...]
 */
let peopleMovingStatusInNodes = [];

/**
 * Agentのリストを受け取り、agentsInStreets, populationDensityInStreets, peopleMovingStatusInStreets を更新する
 * @param {Array<Agent>} agents 
 * @param {Array<LinkWithDistance>} linksWithDistances
*/
function updateAgentsInStreets(agents, linksWithDistances) {

	agentsInStreets = agents.reduce((acc, agent) => {
		acc[agent.currentStreetNumber].push(agent.id);
		return acc;
	}, Array.from({ length: linksWithDistances.length }, () => []));

	populationDensityInStreets = agentsInStreets.map((agents, index) => agents.length / linksWithDistances[index][2]);

	peopleMovingStatusInStreets = agentsInStreets.map((agentIds, index) => {
		const upperNode = links[index][0];
		const lowerNode = links[index][1];
		const upperNodePopulation = agentIds.filter(agentId => agents[agentId].nextNodeNumber === upperNode).length;
		const lowerNodePopulation = agentIds.filter(agentId => agents[agentId].nextNodeNumber === lowerNode).length;
		const stoppingPopulation = agentIds.length - upperNodePopulation - lowerNodePopulation;
		return { up: upperNodePopulation / agentIds.length, down: lowerNodePopulation / agentIds.length, stopping: stoppingPopulation / agentIds.length };
	});
}


/**
 * Agentのリストを受け取り、agentsInNodes, totalPopulationInNodes, peopleMovingStatusInNodes を更新する
 * @param {Array<Agent>} agents 
 * @param {Array<LinkWithDistance>} linksWithDistances
*/
function updateAgentsInNodes(agents, linksWithDistances) {

	agentsInNodes = agents.reduce((acc, agent) => {
		acc[agent.currentNodeNumber].push(agent.id);
		return acc;
	}, Array.from({ length: nodes.length }, () => []));

	totalPopulationInNodes = agentsInNodes.map(agents => agents.length);

	
	peopleMovingStatusInNodes = agentsInNodes.map((agentIds, index) => {
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
}