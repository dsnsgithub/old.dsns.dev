// @ts-check
require("dotenv").config();

const statusJS = require("./status.js");

async function createRecentGamesSSE() { 
	const statusData = await statusJS.grabStatus();

	const result =  {
		DSNS: statusData["DSNS"]["recentGame"],
		AmKale: statusData["AmKale"]["recentGame"],
		jiebi: statusData["jiebi"]["recentGame"],
	};

	return result;
}


module.exports = { createRecentGamesSSE };