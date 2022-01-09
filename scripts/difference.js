// @ts-check
require("dotenv").config();

//? Requirements
const axios = require("axios").default;
const fs = require("fs");

function xpToLevel(xp) {
	return Math.sqrt(2 * xp + 30625) / 50 - 2.5;
}

async function grabPlayerData(UUIDs) {
	const statusURL = `https://api.hypixel.net/player?key=${process.env.API_KEY}&uuid=`;
	const res = await Promise.all(UUIDs.map((UUID) => axios.get(statusURL + UUID)));

	const queryResult = res.map((response) => response.data["player"]);

	if (queryResult.some((t) => !t)) {
		return Promise.reject(new Error("Player API is DOWN!"));
	}

	return queryResult;
}

async function getDifference(playerData) {
	const DSNS = xpToLevel(Number(playerData[0]["networkExp"]));
	const AmKale = xpToLevel(Number(playerData[1]["networkExp"]));
	const jiebi = xpToLevel(Number(playerData[2]["networkExp"]));

	const difference = {
		differenceAmKale: Number((DSNS - AmKale).toFixed(3)),
		differenceJiebi: Number((DSNS - jiebi).toFixed(3))
	};

	return difference;
}

async function writeDifference(difference) {
	const levels = JSON.parse(fs.readFileSync("./json/levels.json", "utf8"));
	const lastItemIndex = levels.length - 1;

	if (lastItemIndex != -1) {
		if (difference["differenceAmKale"] == levels[lastItemIndex]["differenceAmKale"]) {
			if (difference["differenceJiebi"] == levels[lastItemIndex]["differenceJiebi"]) {
				return levels;
			}
		}
	}

	const currentDate = new Date().toLocaleDateString("en-US", {
		hour: "numeric",
		minute: "numeric",
		hour12: true
	});

	const entry = {
		date: currentDate,
		differenceAmKale: difference["differenceAmKale"],
		differenceJiebi: difference["differenceJiebi"]
	};

	levels.push(entry);

	while (levels.length > 200) {
		levels.shift();
	}

	fs.writeFileSync(__dirname + "/../json/levels.json", JSON.stringify(levels));
	console.log("\x1b[33m[" + currentDate + "] \x1b[36m" + "Database Update" + "\x1b[0m");

	return levels;
}

async function createGraphArray(levels) {
	const AmKaleGraphArray = [["Time", "Difference between DSNS and AmKale"]];
	const jiebiGraphArray = [["Time", "Difference between DSNS and jiebi"]];

	for (const i in levels) {
		AmKaleGraphArray.push([levels[i]["date"], levels[i]["differenceAmKale"]]);
		jiebiGraphArray.push([levels[i]["date"], levels[i]["differenceJiebi"]]);
	}

	const result = {
		AmKaleGraphArray: JSON.stringify(AmKaleGraphArray),
		jiebiGraphArray: JSON.stringify(jiebiGraphArray)
	};

	return result;
}

module.exports = { grabPlayerData, getDifference, writeDifference, createGraphArray };
