require("dotenv").config(); //* npm install dotenv

//? Requirements ----------------------------------------------------------------------------------
const { HypixelAPI } = require("hypixel-api-v2"); //* npm install hypixel-api-v2
const hypixel = new HypixelAPI(process.env.API_KEY, 2);

const fs = require("fs");
let levels = require("./levels.json");

const https = require("https"); //* npm install https
const express = require("express"); //* npm install express
const app = express();

app.set("views", "./adamsai.com/difference");

function xpToLevel(xp) {
	return Math.sqrt(2 * xp + 30625) / 50 - 2.5;
}

//? Hypixel Level Functions ------------------------------------------------------------------------------------------
async function grabPlayerData() {
	return Promise.all([
		hypixel.player("557bafa10aad40bbb67207a9cefa8220"), // DSNS
		hypixel.player("9e6cdbe98a744a33b53941cb0efd8113"), // AmKale
		hypixel.player("769f1d98aeef49cd934b4202e1c5537f") // jiebi
	]).catch((error) => {
		console.error("\x1b[31m" + "Unable to complete request to Hypixel API!", error + "\x1b[0m");

		app.get("/difference", function (_req, res) {
			res.status(502);
			res.render("error");
		});

		openPort();
	});
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
	let lastItemIndex = levels.length - 1;

	if (lastItemIndex != -1) {
		if (difference["differenceAmKale"] == levels[lastItemIndex]["differenceAmKale"]) {
			if (difference["differenceJiebi"] == levels[lastItemIndex]["differenceJiebi"]) {
				return;
			}
		}
	}

	let entry = {
		date: new Date().toLocaleDateString("en-US", {
			hour: "numeric",
			minute: "numeric",
			hour12: true
		}),
		differenceAmKale: difference["differenceAmKale"],
		differenceJiebi: difference["differenceJiebi"]
	};

	levels.push(entry);

	while (levels.length > 200) {
		levels.shift();
	}

	fs.writeFileSync("levels.json", JSON.stringify(levels));
	console.log("\x1b[36m" + "Database Updated." + "\x1b[0m");
}

async function createGraphArray() {
	let AmKaleGraphArray = [["Time", "Difference between DSNS and AmKale"]];
	let jiebiGraphArray = [["Time", "Difference between DSNS and jiebi"]];

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

	return [allStatus, allRecentGames];
}

//? Combine Hypixel API functions together  -------------------------------
async function mergeAPI() {
	levels = JSON.parse(fs.readFileSync("levels.json", "utf8"));
	const statusData = await grabStatus();
	const status = await parseStatus(statusData);

	const playerData = await grabPlayerData();
	const difference = await getDifference(playerData);

	const keyData = await hypixel.key(process.env.API_KEY);
	console.log("\x1b[34m" + `Refreshing API. | Key Uses: ${keyData["queriesInPastMin"]} / ${keyData["limit"]}` + "\x1b[0m");

	await writeDifference(difference);
	const graphArray = await createGraphArray();

	const result = {
		status: JSON.stringify(status[0]),
		recentGames: JSON.stringify(status[1]),
		differenceAmKale: difference["differenceAmKale"].toString(),
		differenceJiebi: difference["differenceJiebi"].toString(),
		AmKaleGraphArray: graphArray["AmKaleGraphArray"],
		jiebiGraphArray: graphArray["jiebiGraphArray"],
		date: new Date().toLocaleDateString("en-US", {
			hour: "numeric",
			minute: "numeric",
			hour12: true
		})
	};

	return result;
}

//? Express Server Functions  ---------------------------------------------------------------------
async function sendSSE() {
    let result = await mergeAPI();
    
    setInterval(async () => {
        result = await mergeAPI();
    }, 60000);

	app.get("/differenceData", async (req, res) => {
		res.setHeader("Cache-Control", "no-cache");
		res.setHeader("Content-Type", "text/event-stream");
		res.setHeader("Access-Control-Allow-Origin", "*");
		res.setHeader("Connection", "keep-alive");
		res.flushHeaders();

		//? Send data to client every minute
        res.write(`data: ${JSON.stringify(result)} \n\n`);
        
		const eventSend = setInterval(() => {
			res.write(`data: ${JSON.stringify(result)} \n\n`);
		}, 60000);

		//? If client closes connection, stop sending events
		res.on("close", () => {
			clearInterval(eventSend);
			res.end();
		});
	});
}

async function openPort() {
	app.listen(80);
	console.log("\x1b[32m" + "Express (HTTP) opened Port" + "\x1b[0m",  80);

	if (process.platform != "win32") {
		//? HTTPS Certificates to adamsai.com / portobellomarina.com -----------------------------------------------
		const adamsai = {
			key: fs.readFileSync(process.env["HTTPS_KEY"], "utf8"),
			cert: fs.readFileSync(process.env["HTTPS_CERT"], "utf8"),
			ca: fs.readFileSync(process.env["HTTPS_CHAIN"], "utf8")
		};

		const portobellomarina = {
			key: fs.readFileSync(process.env["SECOND_KEY"], "utf8"),
			cert: fs.readFileSync(process.env["SECOND_CERT"], "utf8"),
			ca: fs.readFileSync(process.env["SECOND_CHAIN"], "utf8")
		};

		const httpsServer = https.createServer(adamsai, app);

		httpsServer.addContext("portobellomarina.com", portobellomarina);
		httpsServer.addContext("www.portobellomarina.com", portobellomarina);

		httpsServer.listen(443, () => {
			console.log("\x1b[32m" + "Express (HTTPS) opened Port" + "\x1b[0m", 443);
		});

		//? HTTPS Proxy for adamsai.com / portobellomarina.com -------------------------------------------------------
		app.use((req, res, next) => {
			if (!req.secure) {
				return res.redirect("https://" + req.headers.host + req.url);
			}

			if (req.hostname == "portobellomarina.com" || req.hostname == "www.portobellomarina.com") {
				if (req.url == "/favicon.ico") {
					return res.sendFile(__dirname + "/portobellomarina.com/" + "/favicon.ico");
				}

				if (req.url.indexOf(".well-known") > -1) {
					return res.sendFile(__dirname + "/portobellomarina.com/" + req.url);
				}

				return res.sendFile(__dirname + "/portobellomarina.com/index.html");
			}

			next();
		});
	}

	app.use(express.static(__dirname + "/adamsai.com", { dotfiles: "allow" }));

	app.use((req, res, next) => {
		return res.redirect("https://www.youtube.com/watch?v=dQw4w9WgXcQ");
	});
}

sendSSE().then(() => openPort());
