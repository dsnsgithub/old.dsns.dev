// @ts-check
require("dotenv").config(); //* npm install dotenv

//? Requirements ----------------------------------------------------------------------------------
const https = require("https");
const fs = require("fs");

const express = require("express"); //* npm install express
const compression = require("compression"); //* npm install compression
const app = express();
app.set("trust proxy", true);

const morgan = require("morgan"); //* npm install morgan
const logStream = fs.createWriteStream(__dirname + "/logs/request.log", { flags: "a" });
// @ts-ignore
morgan.token("host", (req, res) => req.hostname);  

async function runRoutes() {
	const results = await Promise.allSettled([
		require(__dirname + "/routes/differenceSSE.js")(app),
		require(__dirname + "/routes/whois.js")(app),
		app.get("/ipAPI", async (req, res) => res.json(req.headers))
	]);

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
	app.use(compression());
	app.use(morgan(":date[web] | :host:url | :status | :remote-addr", { stream: logStream }));

	app.use((req, res, next) => {
		if (req.hostname == "adamsai.com") return res.redirect(301, "https://dsns.dev" + req.url);

		if (req.hostname == "portobellomarina.com" || req.hostname == "portobellomarina.test") {
			const fullPath = __dirname + "/pages/portobellomarina.com" + req.url;

			if (fs.existsSync(fullPath)) return res.sendFile(fullPath);
			else return res.redirect("https://portobellomarina.com/");
		}

		if (req.hostname == "mseung.dev" || req.hostname == "mseung.test") {
			const fullPath = __dirname + "/pages/mseung.dev" + req.url;

			if (fs.existsSync(fullPath)) return res.sendFile(fullPath);
			else return res.redirect("https://mseung.dev/");
		}

		next();
	});

	app.use(express.static(__dirname + "/pages/dsns.dev"));

	//? 404
	app.use((req, res, next) => {
		return res.sendFile(__dirname + "/pages/private/rickroll.html");
	});
}

runRoutes().then(() => openPort());
