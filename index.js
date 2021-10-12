require("dotenv").config(); //* npm install dotenv

//? Requirements ----------------------------------------------------------------------------------
const express = require("express"); //* npm install express
const app = express();

const hypixel = require("./scripts/createSSEData.js");

app.set("views", __dirname + "/pages/dsns.dev/difference");

//? Express Server Functions  ---------------------------------------------------------------------
async function sendSSE() {
	let result = await hypixel.createSSEData();

	setInterval(async () => {
		result = await hypixel.createSSEData();
    }, process.env["RELOAD_TIME"]);
    
	app.get("/differenceData", async (req, res) => {
		res.setHeader("Cache-Control", "no-cache");
		res.setHeader("Content-Type", "text/event-stream");
		res.setHeader("Access-Control-Allow-Origin", "*");
		res.setHeader("Connection", "keep-alive");
		res.flushHeaders();

		//? Send data to client every minute
		res.write(`data: ${JSON.stringify(result)} \n\n`);

		const sendEvent = setInterval(() => {
			res.write(`data: ${JSON.stringify(result)} \n\n`);
		}, process.env["RELOAD_TIME"]);

		//? If client closes connection, stop sending events
		res.on("close", () => {
			clearInterval(sendEvent);
			res.end();
		});
	});
}

async function useMiddleware() {
	app.use((req, res, next) => {
		if (req.hostname == "portobellomarina.com") {
			if (req.url.includes(".well-known") || req.url.includes("favicon.ico")) {
				return res.sendFile(__dirname + "/pages/portobellomarina.com/" + req.url);
			}

			return res.sendFile(__dirname + "/pages/portobellomarina.com/index.html");
		}

		if (req.hostname == "mseung.dev") {
			return res.sendFile(__dirname + "/pages/mseung.dev" + req.url);
		}

		next();
	});

	app.get("/ipAPI", async (req, res) => res.json(req.headers));

	app.use(express.static(__dirname + "/pages/dsns.dev", { dotfiles: "allow" }));

	//? 404
	app.use((req, res, next) => {
		return res.redirect("https://www.youtube.com/watch?v=dQw4w9WgXcQ");
	});
}

async function openPort() {
	app.listen(80, () => {
		console.log("\x1b[32m" + "Express (HTTP) opened Port" + "\x1b[0m", 80);
	});

	useMiddleware();
}

sendSSE().then(() => openPort());
