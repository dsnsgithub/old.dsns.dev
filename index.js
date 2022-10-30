// @ts-check
require("dotenv").config(); //* npm install dotenv

//? Requirements ----------------------------------------------------------------------------------
const https = require("https");
const fs = require("fs");

const express = require("express"); //* npm install express
const compression = require("compression"); //* npm install compression

const app = express();
app.set("trust proxy", true);

async function runRoutes() {
	app.use(compression());
	app.use(express.urlencoded({ extended: true }));
	app.use(express.json());  

	const routes = [];

	if (process.env["LEVEL"] == "true") routes.push(require(__dirname + "/routes/difference.js")(app));
	if (process.env["WHOIS"] == "true") routes.push(require(__dirname + "/routes/whois.js")(app));
	if (process.env["YOUTUBE"] == "true") routes.push(require(__dirname + "/routes/youtube.js")(app));
	if (process.env["RECENTGAMES"] == "true") routes.push(require(__dirname + "/routes/recentGames.js")(app));
	if (process.env["ONLYEGGROLLS"] == "true") routes.push(require(__dirname + "/routes/shoppingcart.js")(app));

	const results = await Promise.allSettled(routes);
	const failCheck = results.filter((result) => result.status === "rejected");
	if (failCheck.length) console.error("\x1b[31m" + "Route Failure:", JSON.stringify(failCheck) + "\x1b[0m");
}

async function openPort() {
	app.listen(80, () => {
		console.log("\x1b[32m" + "Express (HTTP) opened Port" + "\x1b[33m", 80 + "\x1b[0m");
	});

	if (process.env.HTTPS == "true") useHTTPS();
	useMiddleware();
}

async function useHTTPS() {
	const server = https.createServer(
		{
			key: fs.readFileSync(__dirname + "/certificates/dsns.dev/key.pem"),
			cert: fs.readFileSync(__dirname + "/certificates/dsns.dev/cert.pem")
		},
		app
	);

	server.addContext("mseung.dev", {
		key: fs.readFileSync(__dirname + "/certificates/mseung.dev/key.pem"),
		cert: fs.readFileSync(__dirname + "/certificates/mseung.dev/cert.pem")
	});

	server.addContext("orchardlakehouse.com", {
		key: fs.readFileSync(__dirname + "/certificates/orchardlakehouse.com/key.pem"),
		cert: fs.readFileSync(__dirname + "/certificates/orchardlakehouse.com/cert.pem")
	});

	server.addContext("onlyeggrolls.com", {
		key: fs.readFileSync(__dirname + "/certificates/onlyeggrolls.com/key.pem"),
		cert: fs.readFileSync(__dirname + "/certificates/onlyeggrolls.com/cert.pem")
	});

	server.listen(443, () => {
		console.log("\x1b[32m" + "Express (HTTPS) opened Port" + "\x1b[33m", 443 + "\x1b[0m");
	});
}

async function useMiddleware() {
	app.use((req, res, next) => {
		if (req.hostname == "adamsai.com") return res.redirect(301, "https://dsns.dev" + req.url);

		if (req.hostname == "mseung.dev" || req.hostname == "mseung.test") {
			const fullPath = __dirname + "/pages/mseung.dev" + req.url;

			if (fs.existsSync(fullPath)) return res.sendFile(fullPath);
			else return res.redirect("https://mseung.dev");
		}

		if (req.hostname == "orchardlakehouse.com" || req.hostname == "orchardlakehouse.test") {
			const fullPath = __dirname + "/pages/orchardlakehouse.com" + req.url;

			if (fs.existsSync(fullPath)) return res.sendFile(fullPath);
			else return res.redirect("https://orchardlakehouse.com");
		}

		if (req.hostname == "onlyeggrolls.com" || req.hostname == "onlyeggrolls.test") {
			const fullPath = __dirname + "/pages/onlyeggrolls.com" + req.url;

			if (fs.existsSync(fullPath)) return res.sendFile(fullPath);
			else return res.redirect("https://onlyeggrolls.com");
		}

		next();
	});

	app.use(express.static(__dirname + "/pages/dsns.dev"));

	//? 404
	app.use((req, res, next) => {
		res.status(404);
		return res.sendFile(__dirname + "/pages/private/rickroll.html");
	});
}

runRoutes().then(() => openPort());
