// @ts-check
require("dotenv").config();

//? Requirements ----------------------------------------------------------------------------------
const diffJS = require("./difference.js");
const statusJS = require("./status.js");

async function createDifferenceSSE() {
	const currentDate = new Date().toLocaleDateString("en-US", {
		hour: "numeric",
		minute: "numeric",
		hour12: true
	});

	try {
		console.time("\x1b[33m[" + currentDate + "] \x1b[34m" + "SSE Data Update" + "\x1b[0m");

		const statusData = await statusJS.grabStatus();
		const status = await statusJS.parseData(statusData);

		const playerData = await diffJS.grabPlayerData();
		const difference = await diffJS.getDifference(playerData);

		const levels = await diffJS.writeDifference(difference);
		const graphArray = await diffJS.createGraphArray(levels);

		const result = {
			status: status["status"],
			recentGames: status["recentGames"],
			differenceAmKale: difference["differenceAmKale"].toString(),
			differenceJiebi: difference["differenceJiebi"].toString(),
			AmKaleGraphArray: graphArray["AmKaleGraphArray"],
			jiebiGraphArray: graphArray["jiebiGraphArray"],
			date: currentDate
		};

		console.timeEnd("\x1b[33m[" + currentDate + "] \x1b[34m" + "SSE Data Update" + "\x1b[0m");
		return result;
	} catch (error) {
		console.error("\x1b[31m" + "SSE Error: " + (error.stack || error) + "\x1b[0m");
		return "failed";
	}
}

async function createRecentGamesSSE() {
	const statusData = await statusJS.grabStatus();

	const result = {
		DSNS: statusData["DSNS"]["recentGame"],
		AmKale: statusData["AmKale"]["recentGame"],
		jiebi: statusData["jiebi"]["recentGame"]
	};

	return result;
}

module.exports = { createDifferenceSSE, createRecentGamesSSE };
