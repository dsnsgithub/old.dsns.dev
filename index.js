// @ts-check

require("dotenv").config(); //* npm install dotenv

//? Requirements ----------------------------------------------------------------------------------
const { HypixelAPI } = require("hypixel-api-v2"); //* npm install hypixel-api-v2
const hypixel = new HypixelAPI(process.env.API_KEY);

const fs = require("fs");
const levels = require("./levels.json");

const https = require("https"); //* npm install https
const express = require("express"); //* npm install express
const app = express();

app.set("views", "./adamsai.com/difference");
app.set("view engine", "ejs"); //* npm install ejs

//? Hypixel API Functions -------------------------------------------------------------------------
/**
 * @param {number} xp
 */
function xpToLevel(xp) {
	return Math.sqrt(2 * xp + 30625) / 50 - 2.5;
}

//? Hypixel Level -------------------------------------------------------------------------
async function grabPlayerData() {
	return Promise.all([
		hypixel.player("557bafa10aad40bbb67207a9cefa8220"), // DSNS
		hypixel.player("9e6cdbe98a744a33b53941cb0efd8113"), // AmKale
		hypixel.player("769f1d98aeef49cd934b4202e1c5537f") // jiebi
	]).catch((error) => {
		console.error("Unable to complete request to Hypixel API -- Player Data.", error);

		app.get("/difference", function (_req, res) {
			res.status(502);
			res.render("error", { error: error });
		});

		openPort();
	});
}

/**
 * @param {void | [import("hypixel-api-v2").Player, import("hypixel-api-v2").Player, import("hypixel-api-v2").Player]} playerData
 */
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

/**
 * @param {{differenceAmKale: number; differenceJiebi: number; }} difference
 */
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

	if (levels.length > 200) {
		levels.shift();
	}

	fs.writeFileSync("levels.json", JSON.stringify(levels));
	console.log("Wrote to levels.json");
}

async function createGraphArray() {
	let AmKaleGraphArray = [["Time", "Difference between DSNS and AmKale"]];
	let jiebiGraphArray = [["Time", "Difference between DSNS and jiebi"]];

	for (const i in levels) {
		// @ts-ignore
		AmKaleGraphArray.push([levels[i]["date"], levels[i]["differenceAmKale"]]);
		// @ts-ignore
		jiebiGraphArray.push([levels[i]["date"], levels[i]["differenceJiebi"]]);
	}

	const result = {
		AmKaleGraphArray: JSON.stringify(AmKaleGraphArray),
		jiebiGraphArray: JSON.stringify(jiebiGraphArray)
	};

	return result;
}

//? Hypixel Status / Recent Games  -------------------------------------------------------------------------

async function grabStatus() {
	const status = await Promise.all([
		hypixel.status("557bafa10aad40bbb67207a9cefa8220"), // DSNS
		hypixel.status("9e6cdbe98a744a33b53941cb0efd8113"), // AmKale
		hypixel.status("769f1d98aeef49cd934b4202e1c5537f") // jiebi
	])

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

/**
 * @param {{ DSNS: { status: { online: true; gameType: string; mode: string; map: string; } | { online: false; }; recentGame: import("hypixel-api-v2").GameEntry; }; AmKale: { status: { online: true; gameType: string; mode: string; map: string; } | { online: false; }; recentGame: import("hypixel-api-v2").GameEntry; }; jiebi: { status: { online: true; gameType: string; mode: string; map: string; } | { online: false; }; recentGame: import("hypixel-api-v2").GameEntry; }; }} statusData
 */
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

//? Express Server Functions  ---------------------------------------------------------------------
async function startServer() {
    const statusData = await grabStatus();
	const status = await parseStatus(statusData);

    const playerData = await grabPlayerData();
	const difference = await getDifference(playerData);

	await writeDifference(difference);
	const graphArray = await createGraphArray();

	app.get("/difference", function (req, res) {
		res.render("index", {
			status: JSON.stringify(status[0]),
			recentGames: JSON.stringify(status[1]),
			differenceAmKale: difference["differenceAmKale"].toString(),
			differenceJiebi: difference["differenceJiebi"].toString(),
			AmKaleGraphArray: graphArray["AmKaleGraphArray"],
			jiebiGraphArray: graphArray["jiebiGraphArray"],
			reloadTime: process.env["RELOAD_TIME"].toString(),
			date: new Date().toLocaleDateString("en-US", {
				hour: "numeric",
				minute: "numeric",
				hour12: true
			})
		});
    });
}

async function openPort() {
	app.listen(80);
	console.log("Express server is hosting on Port", 80);

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
			console.log("HTTPS Server running on Port", 443);
		});

		//? HTTPS Proxy for adamsai.com / portobellomarina.com -------------------------------------------------------
        app.use((req, res, next) => {
            //Tracking
            console.log("https://" + req.headers.host + req.url, req.socket.remoteAddress);

			if (!req.secure) {
				return res.redirect("https://" + req.headers.host + req.url);
            }
            
            if (req.hostname == "portobellomarina.com" || req.hostname == "www.portobellomarina.com") {
                //Check if a string contains .well-known
                if (req.url.indexOf(".well-known") > -1) {
                    return res.sendFile(__dirname + "/portobellomarina.com/" + req.url);
                } else {
                    return res.sendFile(__dirname + "/portobellomarina.com/index.html");
                }
			}

			next();
		});

		//? Restart program every MINUTE to clear cache --------------------------
		setTimeout(() => {
			return process.exit(22);
		}, Number(process.env.RELOAD_TIME));
	}

	app.use(express.static(__dirname + "/adamsai.com", { dotfiles: "allow" }));

	// Since this is the last non-error-handling middleware we assume 404, as nothing else responded.
	app.use(function (req, res, next) {
		return res.redirect("https://www.youtube.com/watch?v=dQw4w9WgXcQ");
	});
};


startServer().then(() => openPort());

