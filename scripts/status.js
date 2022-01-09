// @ts-check
require("dotenv").config();

//? Requirements
const axios = require("axios").default;

function capitalize(string) {
	return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

async function grabStatus(UUIDs) {
	const statusURL = `https://api.hypixel.net/status?key=${process.env.API_KEY}&uuid=`;
	const res = await Promise.all(UUIDs.map((UUID) => axios.get(statusURL + UUID)));

	const queryResult = res.map((response) => response.data);
	if (queryResult.some((t) => !t)) return Promise.reject(new Error("Recent Games API is DOWN!"));

	return queryResult;
}

async function grabRecentGames(UUIDs) {
	const recentGamesURL = `https://api.hypixel.net/recentgames?key=${process.env.API_KEY}&uuid=`;
	const res = await Promise.all(UUIDs.map((UUID) => axios.get(recentGamesURL + UUID)));

	const queryResult = res.map((response) => response.data);
	if (queryResult.some((t) => !t)) return Promise.reject(new Error("Recent Games API is DOWN!"));

	return queryResult;
}

async function parseData(statusData, recentGamesData, IGNs) {
	const statusArray = [];
	const recentGamesArray = [];

	for (const i in IGNs) {
		const status = statusData[i]["session"];
		const recentGame = recentGamesData[i]["games"][0];

		statusArray.push(await parseStatus(status, IGNs[i]));
		recentGamesArray.push(await parseRecentGames(recentGame, IGNs[i]));
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

module.exports = { grabStatus, grabRecentGames, parseData };
