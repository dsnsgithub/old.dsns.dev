require("dotenv").config();

//? Requirements ----------------------------------------------------------------------------------
const { HypixelAPI } = require("hypixel-api-v2"); //* npm install hypixel-api-v2
const hypixel = new HypixelAPI(process.env.API_KEY, 2);

const fs = require("fs");

function xpToLevel(xp) {
	return Math.sqrt(2 * xp + 30625) / 50 - 2.5;
}

//? Hypixel Level Functions ------------------------------------------------------------------------------------------
async function grabPlayerData() {
	return Promise.all([
		hypixel.player("557bafa10aad40bbb67207a9cefa8220"), // DSNS
		hypixel.player("9e6cdbe98a744a33b53941cb0efd8113"), // AmKale
		hypixel.player("769f1d98aeef49cd934b4202e1c5537f") // jiebi
	])
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

async function writeDifference(difference, levels) {
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

	fs.writeFileSync("levels.json", JSON.stringify(levels));
	console.log("\x1b[36m" + "Database Update" + "\x1b[0m" + " | " + "\x1b[35m" + currentDate);

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
