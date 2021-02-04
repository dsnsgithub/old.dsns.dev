//! Program Settings ------------------------------------
const port = 8080;
const apiKey = "";
const reloadTime = 60000;
const localhost = false;

//? Refresh the cache ------------------------------------------------------------
setTimeout(function () {
	return process.exit(22);
}, reloadTime);

//? Requirements -------------------------------------------------------------
const HypixelAPI = require("hypixel-api");
const client = new HypixelAPI(apiKey);

const fs = require("fs");
const levels = require("./levels");

const express = require("express");
const app = express();
app.set("view engine", "ejs");

//? Functions ---------------------------------------------------------------------------------------

/**
 * Returns the Hypixel Level based on the Hypixel XP.
 * More info: tinyurl.com/529fz4kc
 * @param {Number} xp - Amount of Hypixel XP.
 */
function xpToLevel(xp) {
	return Math.sqrt(2 * xp + 30625) / 50 - 2.5;
}

/**
 * Returns the player data using the Hypixel API.
 */
async function grabPlayerData() {
	const DSNS = client.getPlayer("name", "DSNS");
	const AmKale = client.getPlayer("name", "AmKale");
    const jiebi = client.getPlayer("name", "jiebi");
    
	return Promise.all([DSNS, AmKale, jiebi]);
}

/**
 * Returns the difference in Hypixel Level between players.
 * @param {Object} playerData - Player data from a Hypixel players. Use grabPlayerData() to get the player data.
 */
async function getDifference(playerData) {
	const DSNS = xpToLevel(playerData[0]["player"]["networkExp"]);
	const AmKale = xpToLevel(playerData[1]["player"]["networkExp"]);
	const jiebi = xpToLevel(playerData[2]["player"]["networkExp"]);

	const difference = {
		differenceAmKale: DSNS - AmKale,
		differenceJiebi: DSNS - jiebi,
	};

	return difference;
}

/**
 * Returns the active and inactive quests for players.
 * @param {Object} playerData - Player data from Hypixel players. Use grabPlayerData() to get the player data.
 */
async function getQuests(playerData) {
	const users = ["DSNS", "AmKale", "jiebi"];
	var quests = [];

	for (i = 0; i < 3; i++) {
		questList = playerData[i].player.quests;

		activeQuests = [];
		unactiveQuests = [];

		for (var o in questList) {
			if (questList[o].active == null) {
				activeQuests.push(o);
			} else {
				unactiveQuests.push(o);
			}
		}

		quests[users[i]] = {};
		quests[users[i]]["inactive"] = activeQuests;
		quests[users[i]]["active"] = unactiveQuests;
	}

	return quests;
}

/**
 * Opens HTTP and HTTPS ports for an express server. Specify port in program settings.
 */
async function openPort() {
	app.listen(port);
	console.log("Express server is hosting on Port", port);

	if (!localhost) {
		const https = require("https");

		const credentials = {
			key: fs.readFileSync("/etc/letsencrypt/live/adamsai.com/privkey.pem","utf8"),
			cert: fs.readFileSync("/etc/letsencrypt/live/adamsai.com/cert.pem","utf8"),
			ca: fs.readFileSync("/etc/letsencrypt/live/adamsai.com/chain.pem","utf8"),
        };
        
		const httpsServer = https.createServer(credentials, app);

		httpsServer.listen(443, () => {
			console.log("HTTPS Server running on port 443");
		});
	}
}

/**
 * Creates a graph array for Google Charts. 
 * @param {Object} playerData - Player data from Hypixel players. Use grabPlayerData() to get the player data.
 */
async function createGraphArray(playerData) {
	//? writeDifference is needed for graphArray to work properly
	const difference = await writeDifference(playerData);

	AmKaleGraphArray = [];
	AmKaleGraphArray.push(["Time", "Difference between DSNS and AmKale"]);

	for (var i in levels) {
		AmKaleGraphArray.push([levels[i].date, levels[i].differenceAmKale]);
	}

	jiebiGraphArray = [];
	jiebiGraphArray.push(["Time", "Difference between DSNS and jiebi"]);

	for (var i in levels) {
		jiebiGraphArray.push([levels[i].date, levels[i].differenceJiebi]);
	}

	const result = {
		AmKaleGraphArray: JSON.stringify(AmKaleGraphArray),
		jiebiGraphArray: JSON.stringify(jiebiGraphArray),
		differenceAmKale: difference.differenceAmKale.toFixed(3).toString(),
		differenceJiebi: difference.differenceJiebi.toFixed(3).toString(),
	};

	return result;
}

/**
 * Writes the difference to a JSON file.
 * @param {Object} playerData - Player data from Hypixel players. Use grabPlayerData() to get the player data.
 */
async function writeDifference(playerData) {
	const difference = await getDifference(playerData);

	let entry = {
		date: new Date().toLocaleTimeString("en-US", {
			hour: "numeric",
			minute: "numeric",
			hour12: true,
		}),
		differenceAmKale: difference.differenceAmKale,
		differenceJiebi: difference.differenceJiebi,
	};

	levels.push(entry);

	fs.writeFile("levels.json", JSON.stringify(levels), (err) => {
		if (err) throw err;
	});

	console.log("Wrote to levels.json");
	return difference;
}

/**
 * Enable the express/ejs server.
 */
async function startServer() {
    const playerData = await grabPlayerData();

    const quests = getQuests(playerData);
    const graphArray = createGraphArray(playerData);
    const result = await Promise.all([graphArray, quests]);


	app.get("/", function (req, res) {
        res.render("index", {
			differenceAmKale: result[0].differenceAmKale,
			differenceJiebi: result[0].differenceJiebi,
			AmKaleGraphArray: result[0].AmKaleGraphArray,
			jiebiGraphArray: result[0].jiebiGraphArray,
			reloadTime: reloadTime.toString(),
			date: new Date(),
		});
    });

    app.get("/quests", function (req, res) {
        res.render("quests", {
			date: new Date(),
			DSNSquest: JSON.stringify(result[1]["DSNS"]),
			AmKalequest: JSON.stringify(result[1]["AmKale"]),
			jiebiquest: JSON.stringify(result[1]["jiebi"]),
		});
	});
}

openPort();
startServer();



