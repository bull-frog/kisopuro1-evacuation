const fs = require('fs');

/**
 * UTF-8形式のCSVファイルを読み込み、二次元配列を返す
 * @param {string} filename ファイル名
 * @param {number} dropHead 頭の何行を落とすか
 * @returns {Array<any>} CSVを配列にしたもの
 */
exports.loadCSV = function(filename, dropHead) {
	const csvText = fs.readFileSync(__dirname + "/" + filename).toString().replace(/\r\n/g, "\n");
	const lines = csvText.split("\n");
	const result = [];
	for (let i = dropHead; i < lines.length; i++) {
		result.push(lines[i].split(","));
	}
	return result;
};

