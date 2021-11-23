// @ts-check
require("dotenv").config();

//? Requirements ----------------------------------------------------------------------------------
const { HypixelAPI } = require("hypixel-api-v2"); //* npm install hypixel-api-v2
const hypixel = new HypixelAPI(process.env.API_KEY, 2);
const gameTypes = require("../json/gameTypes.json");

function capitalize(string) {
	return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

//? Hypixel Status / Recent Games Functions -------------------------------------------------------------------------

async function grabStatus() {
	const status = await Promise.all([
		hypixel.status("557bafa10aad40bbb67207a9cefa8220"), // DSNS
		hypixel.status("9e6cdbe98a744a33b53941cb0efd8113"), // AmKale
		hypixel.status("769f1d98aeef49cd934b4202e1c5537f") // jiebi
	]);

	const recentGames = await Promise.all([
		hypixel.recentGames("557bafa10aad40bbb67207a9cefa8220"), // DSNS
		hypixel.recentGames("9e6cdbe98a744a33b53941cb0efd8113"), // AmKale
		hypixel.recentGames("769f1d98aeef49cd934b4202e1c5537f") // jiebi
	]);

	if (status.some((t) => !t) || recentGames.some((t) => !t)) {
		return Promise.reject("Status API is DOWN!");
	}

	const result = {
		DSNS: {
			status: status[0],
			recentGame: recentGames[0][0]
		},
		AmKale: {
			status: status[1],
			recentGame: recentGames[1][0]
		},
		jiebi: {
			status: status[2],
			recentGame: recentGames[2][0]
		}
	};

	return result;
}

async function parseData(statusData) {
	const statusArray = [];
	const recentGamesArray = [];

	for (const IGN in statusData) {
		const status = statusData[IGN]["status"];
		const recentGame = statusData[IGN]["recentGame"];

		statusArray.push(await parseStatus(status, IGN));
		recentGamesArray.push(await parseRecentGames(recentGame, IGN));
	}

	return {
		status: JSON.stringify(statusArray),
		recentGames: JSON.stringify(recentGamesArray)
	};
}

async function parseStatus(status, IGN) {
	if (!status["online"]) return `${IGN} is offline.`;

	if (status["mode"] == status["gameType"]) {
		return `${IGN} is online. They are playing ${capitalize(status["gameType"])}.`;
	} else {
		return `${IGN} is online. They are playing ${capitalize(status["mode"])} ${capitalize(status["gameType"])}.`;
	}
}

async function parseRecentGames(recentGame, IGN) {
	const game = recentGame["gameType"];
	const map = recentGame["map"];
	let mode = recentGame["mode"];

	const recentTime = new Date(recentGame["date"]).toLocaleDateString("en-US", {
		hour: "numeric",
		minute: "numeric",
		hour12: true
	});

	if (!recentGame) return `${IGN} has no recent games.`;
	if (!recentGame["mode"]) return `${IGN} played ${capitalize(game)} at ${recentTime}.`;

	//? Sanitize Hypixel API into a more readable format
	if (game == "DUELS") mode = mode.replace(/DUELS_/g, "");
	if (game == "BEDWARS") mode = mode.replace(/BEDWARS_/g, "");

	// If the game exists in the gameTypes.json file
	if (gameTypes[game.toUpperCase()]) {
		// If the mode exists in the gameTypes.json file
		if (mode in gameTypes[game.toUpperCase()]["games"]) {
			mode = gameTypes[game.toUpperCase()]["games"][mode];
		}
	}

	return `${IGN} played ${mode} ${capitalize(game)} at ${recentTime} on ${map}.`;
}

module.exports = { grabStatus, parseData };
