/**
 * シミュレーションの時間間隔（秒）
 */
const timeInterval = 10;

/**
 * エージェントのクラス
 * エージェントは、渋谷の道を歩く人間を表す
 * エージェントは、年齢、現在いる道のID、現在いる道における位置、最終目的地のID、渋谷の道に対する知識度を持つ
 */
exports.Agent = class Agent {

	/**
	 * 属性と初期位置を指定し、新しいエージェントを生成する
	 * @param {Number} id エージェントのID
	 * @param {Number} age 年齢に応じてエージェントの移動距離を変えることを考える
	 * @param {Number} initalStreetNumber 初期にいる道のID
	 * @param {Number} initialPositionOnStreet 初期の道における位置（小さい番号側が0~大きい番号側が1の範囲で指定）
	 * @param {Number} finalDestination 最終目的地のID、決まっていない場合は-1
	 * @param {Number} familiarityWithShibuya 渋谷の道をよく知っているかどうか（数字で指定、とりあえず1-2）（将来的にはこれに応じて使用するルートを変えることも考える）
	 * @param {Array<Array<Number>>} routes ダイクストラ法で得られた経路情報
	 * @param {Array<{id: number, startNodeId: number, endNodeId: number, distance: number, width: number}>} linksWithDistances リンクの情報 (id, startNodeId, endNodeId, length, width)
	 */
	constructor(id, age, initalStreetNumber, initialPositionOnStreet, finalDestination, familiarityWithShibuya, routes, linksWithDistances) {
		this.id = id;
		this.age = age;
		this.currentStreetNumber = initalStreetNumber;
		this.currentPositionOnStreet = initialPositionOnStreet;
		this.finalDestination = finalDestination;
		this.familiarityWithShibuya = familiarityWithShibuya;
		this.walkingDistancePerHour = 4000; // 通常の歩行速度（m/h）
		this.isStacked = false; // 前が詰まっていて進めない場合はtrueにする

		/**
		 * エージェントが交差点にいるときは、その交差点のID。いないときは-1
		 * @type {Number}
		 */
		this.currentNodeNumber = -1;

		// エージェントは道のどこかに置かれるので、セットアップする。
		
		// 今いる道の両側の交差点のIDを取得
		/**
		 * @type {{id: number, startNodeId: number, endNodeId: number, distance: number}}
		 */
		const currentStreet = linksWithDistances[initalStreetNumber];
		const upperNode = currentStreet.startNodeId;
		const lowerNode = currentStreet.endNodeId;

		// 目的地に向かうため、最初はどちらの交差点に向かうのかを決める。
		if ((initialPositionOnStreet < 0.5 && routes[this.finalDestination][upperNode] == lowerNode) || (initialPositionOnStreet >= 0.5 && routes[this.finalDestination][lowerNode] != upperNode)) {
			this.nextNodeNumber = lowerNode;
			this.walkDirection = 1;
		} else {
			this.nextNodeNumber = upperNode;
			this.walkDirection = -1;
		}
	}


	/**
	 * タイムステップごとに行う処理
	 */
	timestep(routes, linksWithDistances, linksFromNodes, peopleMovingStatusInStreets, populationDensityInStreets, peopleMovingStatusInNodes, totalPopulationInNodes, nodeIsStacked, capacity) {

		// エージェントが目的地に到着した場合
		if (this.currentNodeNumber === this.finalDestination) {
			this.isStacked = false;
			return;
		}

		// エージェントが交差点にいる場合
		if (this.currentNodeNumber != -1) {
			
			// 次に向かう交差点を決定
			this.nextNodeNumber = routes[this.finalDestination][this.currentNodeNumber];
			let nextLink = linksFromNodes[this.currentNodeNumber].find(link => link.destination === this.nextNodeNumber);
			if (!nextLink) {
				console.log(`Agent${this.id} cannot find the next link from node${this.currentNodeNumber} to node${this.nextNodeNumber}`);
			}

			// もし、すでにスタックしている場合は、ランダムに隣の交差点を目指す
			// if (this.isStacked) {
			// 	const nextNodeCandidates = linksFromNodes[this.currentNodeNumber].filter(link => !nodeIsStacked[link.destination] && (!capacity.find(node => node.nodeId === link.destination) || totalPopulationInNodes.find(node => node.nodeId === link.destination) < capacity.find(node => node.nodeId === link.destination).capacity));
			// 	if (nextNodeCandidates.length === 0) {
			// 		this.isStacked = true;
			// 		return;
			// 	}
			// 	this.nextNodeNumber = nextNodeCandidates[Math.floor(Math.random() * nextNodeCandidates.length)].destination;
			// 	nextLink = linksFromNodes[this.currentNodeNumber].find(link => link.destination === this.nextNodeNumber);
			// }

			// if (populationDensityInStreets[nextLink.linkId] <= 6) {
				// 次に向かう道の人口密度が6人/m^2以下の場合は、道に移動。
				this.isStacked = false;
				this.currentStreetNumber = nextLink.linkId;
				this.currentPositionOnStreet = nextLink.up ? 1 : 0;
				this.walkDirection = nextLink.up ? -1 : 1;
				this.currentNodeNumber = -1;
			// } else {
			// 	// 次に向かう道の人口密度が6人/m^2を超える場合は、交差点に留まる。
			// 	this.isStacked = true;
			// }

		}
		// エージェントが道にいる場合
		else if (this.currentStreetNumber != -1) {

			// linksWithDistancesから、今いる道の長さを取得する
			const currentStreetLength = linksWithDistances[this.currentStreetNumber].distance;

			/*
			 * 道の密度によって、歩く速度を変える。密度と速度の関係は、
			 * https://www.bousai.go.jp/kaigirep/chuobou/senmon/shutohinan/10/
			 * で与えられる通りとする。
			 * 双方向流を考慮するには至っていない
			 */
			// 道にいる場合、今いる道の密度を取得
			if (!this.currentStreetNumber !== -1) {
				const currentStreetPopulationDensity = populationDensityInStreets[this.currentStreetNumber];
				if (currentStreetPopulationDensity < 1.5) {
					this.walkingDistancePerHour = 4000;
				} else if (currentStreetPopulationDensity < 6) {
					this.walkingDistancePerHour = 5200 - 800 * currentStreetPopulationDensity;
				} else if (currentStreetPopulationDensity < 1.5) {
					this.walkingDistancePerHour = 2400 / currentStreetPopulationDensity;
				} else {
					this.walkingDistancePerHour = 1000;
				}
			}

			// timeInterval(s)ごとに、currentPositionOnStreetを増減する
			this.currentPositionOnStreet += (this.walkingDistancePerHour / 3600 * timeInterval / currentStreetLength * this.walkDirection);

			// currentPositionOnStreetが(0,1)を出たら、交差点に移動したものと判断する。ただし、移動先の交差点にisStackedがtrueであるエージェントが存在する場合または、そのノードにいる人数がcapacityに達している場合は、移動しない。
			if ((this.currentPositionOnStreet <= 0 || this.currentPositionOnStreet >= 1)/* && !nodeIsStacked[this.nextNodeNumber] && (!capacity.find(node => node.nodeId === this.nextNodeNumber) || totalPopulationInNodes.find(node => node.nodeId === this.nextNodeNumber) < capacity.find(node => node.nodeId === this.nextNodeNumber).capacity)*/) {
				this.isStacked = false;
				this.currentNodeNumber = this.nextNodeNumber;
				this.nextNodeNumber = -1;
				this.currentStreetNumber = -1;
			} // else {
			// 	this.isStacked = true;
			// 	this.walkingDistancePerHour = 0;
			// }

		}
	}

	/**
	 * エージェントの情報を返す
	 */
	getStatus() {
		return {
			id: this.id,
			age: this.age,
			currentStreetNumber: this.currentStreetNumber,
			currentPositionOnStreet: this.currentPositionOnStreet,
			currentNodeNumber: this.currentNodeNumber,
			nextNodeNumber: this.nextNodeNumber,
			finalDestination: this.finalDestination,
			familiarityWithShibuya: this.familiarityWithShibuya,
			walkingDistancePerHour: this.walkingDistancePerHour,
			isStacked: this.isStacked,
			walkDirection: this.walkDirection
		};
	}
	

};


/**
 * 所与の分布に沿ってエージェントを生成する
 * @param {Array<Agent>} agents エージェントを格納する配列
 * @param {Array<{id: number, startNodeId: number, endNodeId: number, distance: number, width: number}>} linksWithDistances リンクの情報 (id, startNodeId, endNodeId, length, width)
 * @param {Array<Array<Number>>} routes ダイクストラ法で得られた経路情報
 */
exports.generateAgents = function(linksWithDistances, routes, distances) {

	// agentsを初期化
	let agents = [];

	// とりあえず、道の長さに従って等密度で分布させる。目的地も仮に、全員がハチ公前（ID: 187）に向かうものとする。
	const totalDistanceOfLinks = linksWithDistances.reduce((acc, link) => acc + link.distance, 0);
	const totalPopulation = 50000;

	// ハチ公に向かう人の割合を設定
	const ratioOfHachiko = 0.2;

	linksWithDistances.forEach((link, index) => {
		if (index.upperNode == 122 || index.upperNode == 131 || index.upperNode == 187 || index.lowerNode == 122 || index.lowerNode == 131 || index.lowerNode == 187) {
			return;
		}
		let upperNode = link.startNodeId;
		let distanceToNode131 = distances[upperNode][131];
		let distanceToNode122 = distances[upperNode][122];
		let nearestEntranceToYoyogiPark = distanceToNode131 < distanceToNode122 ? 131 : 122;
		const numberOfAgents = Math.round(totalPopulation * link.distance / totalDistanceOfLinks);
		for (let i = 0; i < numberOfAgents; i++) {
			if (Math.random() < ratioOfHachiko) {
				agents.push(new exports.Agent(agents.length, 20, index, Math.random(), 187, Math.round(Math.random() + 1), routes, linksWithDistances));
			} else {
				agents.push(new exports.Agent(agents.length, 20, index, Math.random(), nearestEntranceToYoyogiPark, Math.round(Math.random() + 1), routes, linksWithDistances));
			}
		}
	});

	return agents

}