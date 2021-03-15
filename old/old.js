//! Program Settings ------------------------------------
const port = 8080;
const apiKey = "82994cf3-5124-464c-a6e4-c5e6fcf22c18";
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

function xpToLevel(xp) {
	// https://hypixel.net/threads/python-how-to-get-a-person%E2%80%99s-network-level-from-their-network-exp.3242392/
	return Math.sqrt(2 * xp + 30625) / 50 - 2.5;
}

//? Allows quests
async function grabPlayerData() {
	const DSNS = client.getPlayer("name", "DSNS");
	const AmKale = client.getPlayer("name", "AmKale");
	const jiebi = client.getPlayer("name", "jiebi");
	return Promise.all([DSNS, AmKale, jiebi]);
}

async function getDifference() {
	var playerData = await grabPlayerData();

	const DSNS = xpToLevel(playerData[0]["player"]["networkExp"]);
	const AmKale = xpToLevel(playerData[1]["player"]["networkExp"]);
	const jiebi = xpToLevel(playerData[2]["player"]["networkExp"]);

	const difference = {
		differenceAmKale: DSNS - AmKale,
		differenceJiebi: DSNS - jiebi,
	};

	return difference;
}

async function openPort() {
	if (localhost === true) {
		app.listen(port);
		console.log("Express server is hosting on Port", port);
	}

	if (localhost === false) {
		const http = require("http");
		const https = require("https");

		const privateKey = fs.readFileSync(
			"/etc/letsencrypt/live/adamsai.com/privkey.pem",
			"utf8"
		);
		const certificate = fs.readFileSync(
			"/etc/letsencrypt/live/adamsai.com/cert.pem",
			"utf8"
		);
		const ca = fs.readFileSync(
			"/etc/letsencrypt/live/adamsai.com/chain.pem",
			"utf8"
		);

		const credentials = {
			key: privateKey,
			cert: certificate,
			ca: ca,
		};

		const httpServer = http.createServer(app);
		const httpsServer = https.createServer(credentials, app);

		httpServer.listen(port, () => {
			console.log("HTTP Server running on port", port);
		});
		httpsServer.listen(443, () => {
			console.log("HTTPS Server running on port 443");
		});
	}
}

openPort();
getDifference().then((difference) => {
	//? Write Difference -------------------------------------------------------------------------
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
		console.log("Wrote to levels.json");
	});

	//? Create Graph Array --------------------------------------------------------------------

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

	//? Running Express Server ------------------------------------------------------------------
	app.get("/", function (req, res) {
		res.render("index", {
			differenceAmKale: difference.differenceAmKale.toFixed(3).toString(),
			differenceJiebi: difference.differenceJiebi.toFixed(3).toString(),
			AmKaleGraphArray: JSON.stringify(AmKaleGraphArray),
			jiebiGraphArray: JSON.stringify(jiebiGraphArray),
			reloadTime: reloadTime.toString(),
			date: new Date(),
		});
	});
});

