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

const https = require("https");
const express = require("express");
const app = express();
app.set("view engine", "ejs");

//? Functions ---------------------------------------------------------------------------------------
function xpToLevel(xp) {
	return Math.sqrt(2 * xp + 30625) / 50 - 2.5;
}

(async function () {
	const apiInput = [
		client.getPlayer("name", "DSNS"),
		client.getPlayer("name", "AmKale"),
		client.getPlayer("name", "jiebi"),
	];

	const apiOutput = Promise.all(apiInput);

	const DSNS = xpToLevel(apiOutput[0]["player"]["networkExp"]);
	const AmKale = xpToLevel(apiOutput[1]["player"]["networkExp"]);
	const jiebi = xpToLevel(apiOutput[2]["player"]["networkExp"]);

	let differenceAmKale = DSNS - AmKale;
	let differenceJiebi = DSNS - jiebi;

	let lastItemIndex = levels.length - 1;

	if (
		differenceAmKale != levels[lastItemIndex]?.differenceAmKale ||
		differenceJiebi == levels[lastItemIndex]?.differenceJiebi
	) {
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
	}

	AmKaleGraphArray = [];
	jiebiGraphArray = [];

	AmKaleGraphArray.push(["Time", "Difference between DSNS and AmKale"]);
	jiebiGraphArray.push(["Time", "Difference between DSNS and jiebi"]);

	for (var i in levels) {
		AmKaleGraphArray.push([levels[i].date, levels[i].differenceAmKale]);
		jiebiGraphArray.push([levels[i].date, levels[i].differenceJiebi]);
	}

	const result = {
		AmKaleGraphArray: JSON.stringify(AmKaleGraphArray),
		jiebiGraphArray: JSON.stringify(jiebiGraphArray),
	};

	app.get("/", function (req, res) {
		res.render("index", {
			differenceAmKale: difference.differenceAmKale.toFixed(3).toString(),
			differenceJiebi: difference.differenceJiebi.toFixed(3).toString(),
			AmKaleGraphArray: graphArray.AmKaleGraphArray,
			jiebiGraphArray: graphArray.jiebiGraphArray,
			reloadTime: reloadTime.toString(),
			date: new Date(),
		});
	});

	app.listen(80);
	console.log("Express server is hosting on Port", 80);

	if (!localhost) {
		const credentials = {
			key: fs.readFileSync(
				"/etc/letsencrypt/live/adamsai.com/privkey.pem",
				"utf8"
			),
			cert: fs.readFileSync(
				"/etc/letsencrypt/live/adamsai.com/cert.pem",
				"utf8"
			),
			ca: fs.readFileSync(
				"/etc/letsencrypt/live/adamsai.com/chain.pem",
				"utf8"
			),
		};

		const httpsServer = https.createServer(credentials, app);

		httpsServer.listen(443, () => {
			console.log("HTTPS Server running on Port", 443);
		});
	}
})();
