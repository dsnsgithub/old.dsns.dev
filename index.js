require("dotenv").config(); //* npm install dotenv

//? Requirements ----------------------------------------------------------------------------------
const https = require("https"); //* npm install https
const express = require("express"); //* npm install express
const app = express();

const fs = require("fs");
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

async function useHTTPS() {
	let certs = {};
	const domains = ["adamsai.com", "portobellomarina.com", "mseung.dev", "dsns.dev"];

	for (const value in domains) {
		certs[value] = {
			key: fs.readFileSync("/etc/letsencrypt/live/" + domains[value] + "/privkey.pem", "utf8"),
			cert: fs.readFileSync("/etc/letsencrypt/live/" + domains[value] + "/cert.pem", "utf8"),
			ca: fs.readFileSync("/etc/letsencrypt/live/" + domains[value] + "/chain.pem", "utf8")
		};
	}

	const httpsServer = https.createServer(certs["dsns.dev"], app);

	httpsServer.addContext("portobellomarina.com", certs["portobellomarina.com"]);
	httpsServer.addContext("adamsai.com", certs["adamsai.com"]);
	httpsServer.addContext("mseung.dev", certs["mseung.dev"]);

	httpsServer.listen(443, () => {
		console.log("\x1b[32m" + "Express (HTTPS) opened Port" + "\x1b[0m", 443);
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
        
        next()
	});

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

	if (process.platform != "win32") useHTTPS();

	useMiddleware();
}

sendSSE().then(() => openPort());
