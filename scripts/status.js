// @ts-check
require("dotenv").config();

//? Requirements ----------------------------------------------------------------------------------
const { HypixelAPI } = require("hypixel-api-v2"); //* npm install hypixel-api-v2
const hypixel = new HypixelAPI(process.env.API_KEY, 2);
const gameTypes = require("../json/gameTypes.json");

//? Hypixel Status / Recent Games Functions -------------------------------------------------------------------------

async function grabStatus() {
	const status = await Promise.all([
		hypixel.status("557bafa10aad40bbb67207a9cefa8220"), // DSNS
		hypixel.status("9e6cdbe98a744a33b53941cb0efd8113"), // AmKale
		hypixel.status("769f1d98aeef49cd934b4202e1c5537f") // jiebi
	]);

	if (!status[0] || !status[1] || !status[2]) {
		return "FAILURE";
	}

	const recentGames = await Promise.all([
		hypixel.recentGames("557bafa10aad40bbb67207a9cefa8220"), // DSNS
		hypixel.recentGames("9e6cdbe98a744a33b53941cb0efd8113"), // AmKale
		hypixel.recentGames("769f1d98aeef49cd934b4202e1c5537f") // jiebi
	]);

	if (!recentGames[0] || !recentGames[1] || !recentGames[2]) {
		return "FAILURE";
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

async function parseStatus(statusData) {
	const allStatus = [];
	const allRecentGames = [];

	for (const IGN in statusData) {
		const status = statusData[IGN]["status"];
		const recentGame = statusData[IGN]["recentGame"];

		if (status["online"]) {
			if (status["mode"] == status["gameType"]) {
				allStatus.push(`${IGN} is online. They are playing ${status["gameType"]}.`);
			} else {
				allStatus.push(`${IGN} is online. They are playing ${status["mode"]} ${status["gameType"]}.`);
			}
		} else {
			allStatus.push(`${IGN} is offline.`);
		}

		if (recentGame) {
			const recentTime = new Date(recentGame["date"]).toLocaleDateString("en-US", {
				hour: "numeric",
				minute: "numeric",
				hour12: true
			});

			if (recentGame["mode"]) {
				let game = recentGame["gameType"];
				let mode = recentGame["mode"] || "N/A";
				const map = recentGame["map"] || "N/A";

				if (mode == "LOBBY") {
					mode = "Lobby";
				} else {
					if (game == "DUELS") {
						mode = mode.replace(/DUELS_/g, "");
					}

					if (game == "BEDWARS") {
						mode = mode.replace(/BEDWARS_/g, "");
					}

					if (gameTypes[game.toUpperCase()]) {
						if (mode in gameTypes[game.toUpperCase()]["games"]) {
							mode = gameTypes[game.toUpperCase()]["games"][mode] || mode;
						}
					}
				}

				allRecentGames.push(`${IGN} played ${mode} ${game} at ${recentTime} on ${map}.`);
			} else {
				allRecentGames.push(`${IGN} played ${recentGame["gameType"]} at ${recentTime}.`);
			}
		} else {
			allRecentGames.push(`${IGN} has not played recently.`);
		}
	}

	return {
		status: JSON.stringify(allStatus),
		recentGames: JSON.stringify(allRecentGames)
	};
}

module.exports = { grabStatus, parseStatus };
