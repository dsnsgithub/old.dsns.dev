// @ts-check
require("dotenv").config();

//? Requirements ----------------------------------------------------------------------------------
const diffJS = require("./levelDifference.js");
const statusJS = require("./status.js");

async function createDifferenceSSE(UUIDs, IGNs) {
	const currentDate = new Date().toLocaleDateString("en-US", {
		hour: "numeric",
		minute: "numeric",
		hour12: true
	});

	try {
		const statusData = await statusJS.grabStatus(UUIDs);
		const recentGamesData = await statusJS.grabRecentGames(UUIDs);
		const parsedData = await statusJS.parseData(statusData, recentGamesData, IGNs);

		const playerData = await diffJS.grabPlayerData(UUIDs);
		const difference = await diffJS.getDifference(playerData);

		const levels = await diffJS.writeDifference(difference);
		const graphArray = await diffJS.createGraphArray(levels);

		const result = {
			code: "success",
			status: parsedData["status"],
			recentGames: parsedData["recentGames"],
			differenceAmKale: difference["differenceAmKale"].toString(),
			differenceJiebi: difference["differenceJiebi"].toString(),
			AmKaleGraphArray: graphArray["AmKaleGraphArray"],
			jiebiGraphArray: graphArray["jiebiGraphArray"],
			date: currentDate
		};

		return result;
	} catch (error) {
		if (process.env["NODE_ENV"] == "development") {
			console.error("\x1b[31m" + "Difference SSE Error: " + (error.stack || error) + "\x1b[0m");
		}
		return { code: "failed" };
	}
}

module.exports = { createDifferenceSSE };
