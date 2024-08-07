const fs = require('fs');
const parse = require('csv-parse/sync');

/**
 * UTF-8形式のCSVファイルを読み込み、二次元配列を返す
 * @param {string} filename ファイル名
 * @param {number} dropHead 頭の何行を落とすか
 * @returns {Array<any>} CSVを配列にしたもの
 */
exports.loadCSV = function (filename, dropHead) {
	// const csvText = fs.readFileSync().toString().replace(/\r\n/g, "\n").replace('"', '”');
	// const lines = csvText.split("\n");
	// const result = [];
	// for (let i = dropHead; i < lines.length; i++) {
	// 	result.push(lines[i].split(",").map(value => {
	// 		// valueを数値に変換できるなら変換
	// 		if (!isNaN(value)) {
	// 			return Number(value);
	// 		}
	// 	}));
	// }
	// return result;

	const data = fs.readFileSync(__dirname + "/" + filename);
	const records = parse.parse(data).map(row => row.map(value => {
		// valueを数値に変換できるなら変換
		if (!isNaN(value)) {
			return Number(value);
		}
		return value;
	}));
	return records;

};