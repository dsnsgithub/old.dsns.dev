// @ts-check
require("dotenv").config();

//? Requirements
const axios = require("axios").default;

function capitalize(string) {
	return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

async function grabStatus() {
	const statusURL = `https://api.hypixel.net/status?key=${process.env.API_KEY}&uuid=`;
	const recentGamesURL = `https://api.hypixel.net/recentgames?key=${process.env.API_KEY}&uuid=`;

	const res = await Promise.all([
		axios.get(statusURL + "557bafa10aad40bbb67207a9cefa8220"), // DSNS
		axios.get(statusURL + "9e6cdbe98a744a33b53941cb0efd8113"), // AmKale
		axios.get(statusURL + "769f1d98aeef49cd934b4202e1c5537f"), // jiebi
		axios.get(recentGamesURL + "557bafa10aad40bbb67207a9cefa8220"), // DSNS
		axios.get(recentGamesURL + "9e6cdbe98a744a33b53941cb0efd8113"), // AmKale
		axios.get(recentGamesURL + "769f1d98aeef49cd934b4202e1c5537f") // jiebi
	]);

	const queryResult = res.map((response) => response.data);
	if (queryResult.some((t) => !t)) return Promise.reject(new Error("Status/Recent Games API is DOWN!"));

	const result = {
		DSNS: {
			status: queryResult[0],
			recentGame: queryResult[3]["games"][0]
		},
		AmKale: {
			status: queryResult[1],
			recentGame: queryResult[4]["games"][0]
		},
		jiebi: {
			status: queryResult[2],
			recentGame: queryResult[5]["games"][0]
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
	if (!gameList[game.toUpperCase()]?.["modeNames"]?.[mode]) return [sanitizedGame, mode];
	const sanitizedMode = gameList[game.toUpperCase()]["modeNames"][mode];

	return [sanitizedGame, sanitizedMode];
}

module.exports = { grabStatus, parseData };
