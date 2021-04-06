require("dotenv").config(); //* npm install dotenv

//? Requirements ----------------------------------------------------------------------------------
const HypixelAPI = require("hypixel-api"); //* npm install hypixel-api
const client = new HypixelAPI(process.env.API_KEY);

const fs = require("fs");
const levels = require("./levels"); //* create levels.json with [] inside

const https = require("https"); //* npm install https
const express = require("express"); //* npm install express
const app = express();
app.set("view engine", "ejs"); //* npm install ejs

//? Hypixel API Functions -------------------------------------------------------------------------
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
		differenceJiebi: DSNS - jiebi
	};

	return difference;
}

async function writeDifference(difference) {
	let lastItemIndex = levels.length - 1;

	if (lastItemIndex != -1) {
		if (difference.differenceAmKale == levels[lastItemIndex].differenceAmKale) {
			if (difference.differenceJiebi == levels[lastItemIndex].differenceJiebi) {
				return;
			}
		}
	}

	let entry = {
		date: new Date().toLocaleTimeString("en-US", {
			hour: "numeric",
			minute: "numeric",
			hour12: true
		}),
		differenceAmKale: difference.differenceAmKale,
		differenceJiebi: difference.differenceJiebi
	};

	levels.push(entry);

	fs.writeFileSync("levels.json", JSON.stringify(levels));
	console.log("Wrote to levels.json");
}

async function createGraphArray() {
	AmKaleGraphArray = [["Time", "Difference between DSNS and AmKale"]];
	jiebiGraphArray = [["Time", "Difference between DSNS and jiebi"]];

	for (var i in levels) {
		AmKaleGraphArray.push([levels[i].date, levels[i].differenceAmKale]);
		jiebiGraphArray.push([levels[i].date, levels[i].differenceJiebi]);
	}

	const result = {
		AmKaleGraphArray: JSON.stringify(AmKaleGraphArray),
		jiebiGraphArray: JSON.stringify(jiebiGraphArray)
	};

	return result;
}

//? Express Server Functions  ---------------------------------------------------------------------
async function startServer() {
	const playerData = await grabPlayerData();
	const difference = await getDifference(playerData);

	await writeDifference(difference);
	const graphArray = await createGraphArray();

	app.get("/", function (req, res) {
		res.render("index", {
			differenceAmKale: difference.differenceAmKale.toFixed(3).toString(),
			differenceJiebi: difference.differenceJiebi.toFixed(3).toString(),
			AmKaleGraphArray: graphArray.AmKaleGraphArray,
			jiebiGraphArray: graphArray.jiebiGraphArray,
			reloadTime: process.env.RELOAD_TIME.toString(),
			date: new Date().toLocaleDateString("en-US", {
				hour: "numeric",
				minute: "numeric",
				hour12: true
			})
		});
	});
    
    app.use(express.static(__dirname + "/static", { dotfiles: "allow" }));
}

async function openPort() {
	app.listen(80);
	console.log("Express server is hosting on Port", 80);

	if (process.platform != "win32") {
		const credentials = {
			key: fs.readFileSync(process.env.HTTPS_KEY, "utf8"),
			cert: fs.readFileSync(process.env.HTTPS_CERT, "utf8"),
			ca: fs.readFileSync(process.env.HTTPS_CHAIN, "utf8")
		};

		const httpsServer = https.createServer(credentials, app);

		httpsServer.listen(443, () => {
			console.log("HTTPS Server running on Port", 443);
		});

		setTimeout(function () {
			//* restarts program to remove cache
			return process.exit(22);
		}, process.env.RELOAD_TIME);
	}
}

startServer().then(() => openPort());
