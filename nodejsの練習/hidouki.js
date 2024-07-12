
// Promiseを返す関数
function asyncFunc() {

	// Promise
	return new Promise((resolve) => {
		let result = 0;
		for (i = 0; i < 1000000; i++) {
			result += 0.001;
		}
		resolve(result);
	});
}

(async function main() {
	console.log("start");

	// ５個のPromiseを作成
	const promises = ["1", "2", "3", "4", "5"].map((str) => asyncFunc(str));

	// ５個のPromiseを並列に実行し、その結果をまとめる
	results2 = await Promise.all(promises); // 並列実行して全ての完了を待ち合わせる
	console.log(results2);
	// Promise.all(promises).then((results) => {
	// 	console.log(results);
	// });
	console.log("end");
})();
