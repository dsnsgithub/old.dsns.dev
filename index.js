// @ts-check
require("dotenv").config(); //* npm install dotenv

//? Requirements ----------------------------------------------------------------------------------
const https = require("https");
const fs = require("fs");
const path = require("path");

const express = require("express"); //* npm install express
const compression = require("compression"); //* npm install compression

const app = express();
app.set("trust proxy", true);

async function runRoutes() {
	try {
		app.use(compression());

		if (process.env["PROXY"] == "true") require(__dirname + "/routes/proxy.js")(app);

		app.use(express.urlencoded({ extended: true }));
		app.use(express.json());

		if (process.env["LEVEL"] == "true") require(__dirname + "/routes/difference.js")(app);
		if (process.env["WHOIS"] == "true") require(__dirname + "/routes/whois.js")(app);
		if (process.env["YOUTUBE"] == "true") require(__dirname + "/routes/youtube.js")(app);
		if (process.env["ONLYEGGROLLS"] == "true") require(__dirname + "/routes/shoppingcart.js")(app);
	} catch (error) {
		console.error("\x1b[31m" + "Route Failure:", JSON.stringify(error) + "\x1b[0m");
	}
}

async function openPort() {
	app.listen(80, () => {
		console.log("\x1b[32m" + "Express (HTTP) opened Port" + "\x1b[33m", 80 + "\x1b[0m");
	});

	if (process.env.HTTPS == "true") useHTTPS();
	useMiddleware();
}

async function useHTTPS() {
	function keyPair(domain) {
		return {
			key: fs.readFileSync(`${__dirname}/certificates/${domain}/key.pem`),
			cert: fs.readFileSync(`${__dirname}/certificates/${domain}/cert.pem`)
		};
	}

	const server = https.createServer(keyPair("dsns.dev"), app);

	const domains = ["mseung.dev", "orchardlakehouse.com", "onlyeggrolls.com"];
	for (const domain of domains) {
		const context = keyPair(domain);

		server.addContext(domain, context);
		server.addContext(`*.${domain}`, context);
	}

	server.listen(443, () => {
		console.log("\x1b[32m" + "Express (HTTPS) opened Port" + "\x1b[33m", 443 + "\x1b[0m");
	});
}

async function useMiddleware() {
	app.use((req, res, next) => {
		if (req.hostname == "adamsai.com") return res.redirect(301, "https://dsns.dev" + req.url);

		let domain = "";
		if (req.hostname.startsWith("dsns")) domain = "dsns.dev";
		else if (req.hostname.startsWith("mseung")) domain = "mseung.dev";
		else if (req.hostname.startsWith("orchardlakehouse")) domain = "orchardlakehouse.com";
		else if (req.hostname.startsWith("onlyeggrolls")) domain = "onlyeggrolls.com";

		const fullPath = `${__dirname}/pages/${domain}${req.url}`;
		if (fs.existsSync(fullPath)) {
			if (!path.extname(fullPath) && !fullPath.endsWith("/")) {
				return res.redirect(req.path + "/");
			}

			return res.sendFile(fullPath);
		}

		//? 404
		res.status(404);
		return res.redirect(`https://${req.hostname}/404.html`);
	});
}

runRoutes();
openPort();
