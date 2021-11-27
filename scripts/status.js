// @ts-check
require("dotenv").config();

//? Requirements ----------------------------------------------------------------------------------
const { HypixelAPI } = require("hypixel-api-v2"); //* npm install hypixel-api-v2
const hypixel = new HypixelAPI(process.env.API_KEY, 2);

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
		return Promise.reject(new Error("Status API is DOWN!"));
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

	const game = status["gameType"];
	const mode = status["mode"];

	if (mode == game) {
		return `${IGN} is online. They are playing ${capitalize(game)}.`;
	} else {
		if (status["mode"] == "LOBBY") return `${IGN} is online. They are in a ${capitalize(game)} Lobby`;

		const [sanitizedGame, sanitizedMode] = await sanitizeMode(game, mode);
		return `${IGN} is online. They are playing ${sanitizedMode} ${sanitizedGame}.`;
	}
}

async function parseRecentGames(recentGame, IGN) {
	if (!recentGame) return `${IGN} has no recent games.`;

	const recentTime = new Date(recentGame["date"]).toLocaleDateString("en-US", {
		hour: "numeric",
		minute: "numeric",
		hour12: true
	});

	const game = recentGame["gameType"];
	const mode = recentGame["mode"];
	const map = recentGame["map"];
	
	if (!mode) return `${IGN} played ${capitalize(game)} at ${recentTime}.`;

	//? Sanitize Hypixel API into a more readable format
	const [sanitizedGame, sanitizedMode] = await sanitizeMode(game, mode);
	return `${IGN} played ${sanitizedMode} ${sanitizedGame} at ${recentTime} on ${map}.`;
}

async function sanitizeMode(game, mode) {
	const gameList = require("../json/games.json")["games"];
	
	//? If the game doesn't exist in the games.json file
	if (!gameList[game.toUpperCase()]) return [mode, game];
	const sanitizedGame = gameList[game.toUpperCase()]["name"];

	//? If the mode doesn't exist in the games.json file
	if (!gameList[game.toUpperCase()]["modeNames"][mode]) return [sanitizedGame, mode];
	const sanitizedMode = gameList[game.toUpperCase()]["modeNames"][mode];
	
	return [sanitizedGame, sanitizedMode];
}

module.exports = { grabStatus, parseData };
