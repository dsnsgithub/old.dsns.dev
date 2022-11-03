// @ts-check

//? Requirements
const fs = require("fs");
const path = require("path");
const hypixel = require("./hypixel.js");

function xpToLevel(xp) {
	return Math.sqrt(2 * xp + 30625) / 50 - 2.5;
}

async function grabPlayerData(UUIDs) {
	return Promise.all(UUIDs.map((UUID) => hypixel.getPlayer(UUID)));
}

async function getDifference(playerData) {
	const DSNS = xpToLevel(Number(playerData[0]["totalExperience"]));
	const AmKale = xpToLevel(Number(playerData[1]["totalExperience"]));
	const jiebi = xpToLevel(Number(playerData[2]["totalExperience"]));

	const difference = {
		differenceAmKale: Number((DSNS - AmKale).toFixed(3)),
		differenceJiebi: Number((DSNS - jiebi).toFixed(3))
	};

	return difference;
}

async function writeDifference(difference) {
	const levels = JSON.parse(fs.readFileSync(path.resolve(__dirname + "/../../json/levels.json"), "utf8"));
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

	fs.writeFileSync(path.resolve(__dirname + "/../../json/levels.json"), JSON.stringify(levels));

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
