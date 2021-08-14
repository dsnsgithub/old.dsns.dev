require("dotenv").config();

//? Requirements ----------------------------------------------------------------------------------
const { HypixelAPI } = require("hypixel-api-v2"); //* npm install hypixel-api-v2
const hypixel = new HypixelAPI(process.env.API_KEY, 2);

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
	let allStatus = [];
	let allRecentGames = [];

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

		const recentTime = new Date(recentGame["date"]).toLocaleDateString("en-US", {
			hour: "numeric",
			minute: "numeric",
			hour12: true
		});

		if (recentGame["mode"]) {
			allRecentGames.push(`${IGN} played ${recentGame["mode"]} ${recentGame["gameType"]} at ${recentTime}.`);
		} else {
			allRecentGames.push(`${IGN} played ${recentGame["gameType"]} at ${recentTime}.`);
		}
	}

    return {
        status: JSON.stringify(allStatus),
        recentGames: JSON.stringify(allRecentGames)
	}
}


module.exports = { grabStatus, parseStatus };