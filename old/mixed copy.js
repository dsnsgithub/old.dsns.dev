//! Program Settings ------------------------------------
const apiKey = "82994cf3-5124-464c-a6e4-c5e6fcf22c18";
const reloadTime = 60000;
const localhost = true;

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


function xpToLevel(xp) {
	return Math.sqrt(2 * xp + 30625) / 50 - 2.5;
}

async function grabPlayerData() {
	const DSNS = client.getPlayer("name", "DSNS");
	const AmKale = client.getPlayer("name", "AmKale");
    const jiebi = client.getPlayer("name", "jiebi");
    
	return Promise.all([DSNS, AmKale, jiebi]);   
}

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


// async function getQuests(playerData) {
// 	const users = [
// 		["DSNS", playerData[0]],
// 		["AmKale", playerData[1]],
// 		["jiebi", playerData[2]],
//     ];
    
// 	var quests = [];

//     for (var i of users) {
//         const user = i[0];
//         const userData = i[1];
        

// 		questList = userData.player.quests;

// 		activeQuests = [];
// 		unactiveQuests = [];

// 		for (var o in questList) {
// 			if (questList[o].active == null) {
// 				activeQuests.push(o);
// 			} else {
// 				unactiveQuests.push(o);
// 			}
// 		}

// 		quests[user] = {};
// 		quests[user]["inactive"] = activeQuests;
// 		quests[user]["active"] = unactiveQuests;
// 	}

// 	return quests;
// }


// async function getWL(playerData) {
// 	const users = [
// 		["DSNS", playerData[0]],
// 		["AmKale", playerData[1]],
// 		["jiebi", playerData[2]],
//     ];
    

// 	const WL = {};

// 	for (var i of users) {
// 		const user = i[0];
//         const userData = i[1];

// 		const duels = userData["player"]["stats"]["Duels"];
// 		const bedwars = userData["player"]["stats"]["Bedwars"];

// 		WL[user] = {};

// 		WL[user]["classic"] =
// 			duels["classic_duel_wins"] / duels["classic_duel_losses"];

// 		WL[user]["bridge"] =
// 			duels["bridge_duel_wins"] / duels["bridge_duel_losses"];

// 		WL[user]["soloBedwars"] =
// 			bedwars["eight_one_wins_bedwars"] /
// 			bedwars["eight_one_losses_bedwars"];
// 	}

// 	return WL;
// }



async function openPort() {
	app.listen(80);
	console.log("Express server is hosting on Port", 80);

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

async function createGraphArray(playerData) {
	//? writeDifference is needed for graphArray to work properly
	await writeDifference(playerData);

	AmKaleGraphArray = [];

    for (var i in levels) {
        if (levels[i].differenceAmKale != levels[i - 1]?.differenceAmKale || levels[i].differenceAmKale != levels[i + 1]?.differenceAmKale)
            //AmKaleGraphArray.push({ x: i, y: levels[i].differenceAmKale });

            console.log(`(${i},${levels[i].differenceAmKale})`);
        }
			
	

    console.log(AmKaleGraphArray)
	jiebiGraphArray = [];

	for (var i in levels) {
        jiebiGraphArray.push({ x:i, y:levels[i].differenceJiebi });
	}

	const result = {
		AmKaleGraphArray: JSON.stringify(AmKaleGraphArray),
		jiebiGraphArray: JSON.stringify(jiebiGraphArray),
	};

	return result;
}

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


async function startServer() {
    const playerData = await grabPlayerData();

    const graphArray = await createGraphArray(playerData);

	app.get("/", function (req, res) {
        res.render("chart", {
			AmKaleGraphArray: graphArray.AmKaleGraphArray,
			jiebiGraphArray: graphArray.jiebiGraphArray,
			reloadTime: reloadTime.toString(),
			date: new Date(),
		});
    });
}


startServer().then(() => openPort());



