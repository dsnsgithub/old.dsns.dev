require("dotenv").config();

//? Requirements ----------------------------------------------------------------------------------
const diffJS = require("./difference.js");
const statusJS = require("./status.js");
const weeklyStatJS = require("./weeklyStats.js");

const fs = require("fs");

async function createSSEData() {
	let levels = JSON.parse(fs.readFileSync("levels.json", "utf8"));
	const statusData = await statusJS.grabStatus();
	const status = await statusJS.parseStatus(statusData);

	const playerData = await diffJS.grabPlayerData();
	const difference = await diffJS.getDifference(playerData);
    
    const weeklyStats = await weeklyStatJS.saveStats(playerData);

    levels = await diffJS.writeDifference(difference, levels);
    const graphArray = await diffJS.createGraphArray(levels);
    
    const newDate = new Date().toLocaleDateString("en-US", {
		hour: "numeric",
		minute: "numeric",
		hour12: true
	});

    console.log("\x1b[34m" + "SSE Data Update" + "\x1b[0m" + " | " + "\x1b[35m" + newDate + "\x1b[0m");
    
	const result = {
		status: status["status"],
		recentGames: status["recentGames"],
		differenceAmKale: difference["differenceAmKale"].toString(),
		differenceJiebi: difference["differenceJiebi"].toString(),
		AmKaleGraphArray: graphArray["AmKaleGraphArray"],
		jiebiGraphArray: graphArray["jiebiGraphArray"],
		date: newDate,
	};

	return result;
}

module.exports = { createSSEData };