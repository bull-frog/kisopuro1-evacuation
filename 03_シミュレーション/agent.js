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
	 * @param {Number} initialPositionOnStreet 初期の道における位置（0~1の範囲で指定）
	 * @param {Number} finalDestination 最終目的地のID、決まっていない場合は-1
	 * @param {Number} familiarityWithShibuya 渋谷の道をよく知っているかどうか（数字で指定、とりあえず1-2）（将来的にはこれに応じて使用するルートを変えることも考える）
	 */
	constructor(id, age, initalStreetNumber, initialPositionOnStreet, finalDestination, familiarityWithShibuya) {
		this.id = id;
		this.age = age;
		this.currentStreetNumber = initalStreetNumber;
		this.currentPositionOnStreet = initialPositionOnStreet;
		this.finalDestination = finalDestination;
		this.familiarityWithShibuya = familiarityWithShibuya;
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
	timestep(routes, linksWithDistances) {

		// エージェントが交差点にいる場合
		if (this.currentNodeNumber != -1) {
			
			// 次に向かう交差点を決定
			this.nextNodeNumber = routes[this.finalDestination][this.currentNodeNumber];

			// 次に向かう交差点が決まったら、次に向かう道を決定
			

		}
	}
};