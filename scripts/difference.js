// @ts-check
require("dotenv").config();

//? Requirements
const axios = require("axios").default;
const fs = require("fs");

function xpToLevel(xp) {
	return Math.sqrt(2 * xp + 30625) / 50 - 2.5;
}

async function grabPlayerData() {
	const baseURL = `https://api.hypixel.net/player?key=${process.env.API_KEY}&uuid=`;

	const res = await Promise.all([
		axios.get(baseURL + "557bafa10aad40bbb67207a9cefa8220"), // DSNS
		axios.get(baseURL + "9e6cdbe98a744a33b53941cb0efd8113"), // AmKale
		axios.get(baseURL + "769f1d98aeef49cd934b4202e1c5537f") // jiebi
	]);

	return res.map((response) => response.data["player"]);
}

async function getDifference(playerData) {
	if (playerData.some((t) => !t)) return Promise.reject(new Error("Player API is DOWN!"));

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
	const currentDate = new Date().toLocaleDateString("en-US", {
		hour: "numeric",
		minute: "numeric",
		hour12: true
	});

	console.time("\x1b[33m[" + currentDate + "] \x1b[36m" + "Database Update" + "\x1b[0m");

	const levels = JSON.parse(fs.readFileSync("./json/levels.json", "utf8"));
	const lastItemIndex = levels.length - 1;

	if (lastItemIndex != -1) {
		if (difference["differenceAmKale"] == levels[lastItemIndex]["differenceAmKale"]) {
			if (difference["differenceJiebi"] == levels[lastItemIndex]["differenceJiebi"]) {
				return levels;
			}
		}
	}

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
	console.timeEnd("\x1b[33m[" + currentDate + "] \x1b[36m" + "Database Update" + "\x1b[0m");

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
