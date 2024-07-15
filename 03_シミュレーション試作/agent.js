/**
 * シミュレーションの時間間隔（秒）
 */
const timeInterval = 10;

/**
 * エージェントのクラス
 * エージェントは、渋谷の道を歩く人間を表す
 * エージェントは、年齢、現在いる道のID、現在いる道における位置、最終目的地のID、渋谷の道に対する知識度を持つ
 */
module.exports = class Agent {

	/**
	 * 
	 * @param {Number} id エージェントのID（連番）
	 * @param {Number} age 年齢に応じてエージェントの移動距離を変えることを考える
	 * @param {Number} initalStreetNumber 初期にいる道のID
	 * @param {Number} initialPositionOnStreet 初期の道における位置（小さい番号側が0~大きい番号側が1の範囲で指定）
	 * @param {Number} finalDestination 最終目的地のID、決まっていない場合は-1
	 * @param {Number} familiarityWithShibuya 渋谷の道をよく知っているかどうか（数字で指定、とりあえず1-2）（将来的にはこれに応じて使用するルートを変えることも考える）
	 * @param {Array<Array<Number>>} routes ダイクストラ法で得られた経路情報
	 * @param {Array<Array<Number>>} linksWithDistances リンクの情報（[startId, endId, length]）
	 */
	constructor(id, age, initalStreetNumber, initialPositionOnStreet, finalDestination, familiarityWithShibuya, routes, linksWithDistances) {
		this.id = id;
		this.age = age;
		this.currentStreetNumber = initalStreetNumber;
		this.currentPositionOnStreet = initialPositionOnStreet;
		this.finalDestination = finalDestination;
		this.familiarityWithShibuya = familiarityWithShibuya;

		// エージェントは道のどこかに置かれるので、セットアップする
		this.currentNodeNumber = -1;
		// 今いる道の両側の交差点のIDを取得
		const currentStreet = linksWithDistances[initalStreetNumber];
		const upperNode = currentStreet[0];
		const lowerNode = currentStreet[1];
		// どちらの交差点に近いかを判定し、次の行き先を決める
		if ((initialPositionOnStreet < 0.5 && routes[this.finalDestination][this.upperNode] == lowerNode) || initialPositionOnStreet >= 0.5) {
			this.nextNodeNumber = lowerNode;
			this.walkDirection = 1;
		} else {
			this.nextNodeNumber = upperNode;
			this.walkDirection = -1;
		}
	}

	/**
	 * エージェントが交差点にいるときは、その交差点のID
	 * いないときは-1
	 */
	currentNodeNumber = -1;

	/**
	 * エージェントが次に向かう交差点のID、どこにも向かわないときは-1
	 */
	nextNodeNumber = -1;

	/**
	 * タイムステップごとに行う処理
	 */
	timestep(routes, linksWithDistances, linksFromNodes) {

		// エージェントが交差点にいる場合
		if (this.currentNodeNumber != -1) {
			
			// 次に向かう交差点を決定
			this.nextNodeNumber = routes[this.finalDestination][this.currentNodeNumber];

			// 次に向かう交差点が決まったら、道に移動
			let nextLink = linksFromNodes[this.currentNodeNumber].find(link => link.destination === this.nextNodeNumber);
			// console.log(`nextLink: ${nextLink}`);
			this.currentStreetNumber = nextLink.link;
			this.currentPositionOnStreet = nextLink.up ? 1 : 0;
			this.walkDirection = nextLink.up ? -1 : 1;
			this.currentNodeNumber = -1;

		}
		// エージェントが道にいる場合
		else if (this.currentStreetNumber != -1) {

			
			// 歩を進める。とりあえず、3km/hで計算する。
			
			// linksWithDistancesから、今いる道の長さを取得する
			const currentStreetLength = linksWithDistances[this.currentStreetNumber][2];

			// 1時間あたりの歩く距離（m）
			// ToDo: 密度や年齢に応じて歩く速度を変える
			let walkingDistancePerHour = 3000;

			// timeInterval(s)ごとに、currentPositionOnStreetを増減する
			this.currentPositionOnStreet += (walkingDistancePerHour / 3600 * timeInterval / currentStreetLength * this.walkDirection);

			// currentPositionOnStreetが(0,1)を出たら、交差点に移動したものと判断する
			if (this.currentPositionOnStreet <= 0 || this.currentPositionOnStreet >= 1) {
				this.currentNodeNumber = this.nextNodeNumber;
				this.nextNodeNumber = -1;
				this.currentStreetNumber = -1;
			}

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
			familiarityWithShibuya: this.familiarityWithShibuya
		};
	}
	

};