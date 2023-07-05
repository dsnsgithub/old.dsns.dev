// @ts-check
require("dotenv").config(); //* npm install dotenv

//? Requirements ----------------------------------------------------------------------------------
import https from "https";
import fs from "fs";
import path from "path";

import express from "express"
import compression from "compression"

const app = express();
app.set("trust proxy", true);

async function runRoutes() {
	try {
		app.use(compression());

		if (process.env["PROXY"] == "true") require(__dirname + "/routes/proxy.ts")(app);

		app.use(express.urlencoded({ extended: true }));
		app.use(express.json());

		if (process.env["HYPIXEL"] == "true") require(__dirname + "/routes/hypixel.ts")(app);
		if (process.env["WHOIS"] == "true") require(__dirname + "/routes/whois.ts")(app);
		if (process.env["YOUTUBE"] == "true") require(__dirname + "/routes/youtube.ts")(app);
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
	function keyPair(domain: string) {
		return {
			key: fs.readFileSync(`${__dirname}/certificates/${domain}/key.pem`),
			cert: fs.readFileSync(`${__dirname}/certificates/${domain}/cert.pem`)
		};
	}

	const server = https.createServer(keyPair("dsns.dev"), app);

	const files = fs.readdirSync(`${__dirname}/certificates/`, { withFileTypes: true });
	const domains = files.filter((file) => file.isDirectory()).map((folder) => folder.name);

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
		const hostnameList = req.hostname.split(".");
		const name = hostnameList[hostnameList.length - 2];

		let domain = "";
		switch (name) {
			case "adamsai":
				return res.redirect(301, "https://dsns.dev" + req.url);
			case "dsns":
				domain = "dsns.dev";
				break;
			case "mseung":
				domain = "mseung.dev";
				break;
			case "orchardlakehouse":
				domain = "orchardlakehouse.com";
				break;
			case "onlyeggrolls":
				domain = "onlyeggrolls.com";
				break;
		}

		if (hostnameList.length > 2) return res.redirect(`https://${domain}` + req.url);

		const fullPath = path.normalize(`${__dirname}/pages/${domain}${req.url.split("?")[0]}`);
		if (fs.existsSync(fullPath)) {
			if (fs.lstatSync(fullPath).isDirectory()) {
				return res.sendFile(fullPath + "index.html");
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
