// @ts-check
require("dotenv").config(); //* npm install dotenv

//? Requirements ----------------------------------------------------------------------------------
const https = require("https");
const fs = require("fs");

const express = require("express"); //* npm install express
const app = express();
app.set("trust proxy", true);

async function runRoutes() {
	await require(__dirname + "/routes/differenceSSE.js")(app);
	await require(__dirname + "/routes/studentindex.js")(app);
	await require(__dirname + "/routes/whois.js")(app);
	app.get("/ipAPI", async (req, res) => res.json(req.headers));
}

async function openPort() {
	app.listen(80, () => {
		console.log("\x1b[32m" + "Express (HTTP) opened Port" + "\x1b[33m", 80 + "\x1b[0m");
	});

	if (process.env["HTTPS"] == "true") useHTTPS();
	useMiddleware();
}

async function useHTTPS() {
	const server = https.createServer({
		key: fs.readFileSync(__dirname + "/certificates/dsns.dev/cert.key"),
		cert: fs.readFileSync(__dirname + "/certificates/dsns.dev/cert.pem")
	}, app);

	server.addContext("portobellomarina.com", {
		key: fs.readFileSync(__dirname + "/certificates/portobellomarina.com/cert.key"),
		cert: fs.readFileSync(__dirname + "/certificates/portobellomarina.com/cert.pem")
	});

	server.addContext("mseung.dev", {
		key: fs.readFileSync(__dirname + "/certificates/mseung.dev/cert.key"),
		cert: fs.readFileSync(__dirname + "/certificates/mseung.dev/cert.pem")
	});

	server.listen(443, () => {
		console.log("\x1b[32m" + "Express (HTTPS) opened Port" + "\x1b[33m", 443 + "\x1b[0m");
	});
}

async function useMiddleware() {
	app.use((req, res, next) => {
		console.log("\x1b[36m" + "Request:" + "\x1b[35m", req.hostname + req.url, "\x1b[0m" + "|" + "\x1b[33m", req.ip);

		if (req.hostname == "adamsai.com") return res.redirect(301, "https://dsns.dev" + req.url);

		if (req.hostname == "portobellomarina.com") {
			const fullPath = __dirname + "/pages/portobellomarina.com" + req.url;

			if (fs.existsSync(fullPath)) {
				return res.sendFile(fullPath);
			} else {
				return res.redirect("https://portobellomarina.com/");
			}
		}

		if (req.hostname == "mseung.dev") {
			const fullPath = __dirname + "/pages/mseung.dev" + req.url;
			if (fs.existsSync(fullPath)) return res.sendFile(fullPath);
		}

		next();
	});

	app.use(express.static(__dirname + "/pages/dsns.dev", { dotfiles: "allow" }));

	//? 404
	app.use((req, res, next) => {
		return res.sendFile(__dirname + "/pages/private/rickroll.html");
	});
}

runRoutes().then(() => openPort());
