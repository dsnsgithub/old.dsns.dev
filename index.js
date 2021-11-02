// @ts-check
require("dotenv").config(); //* npm install dotenv

//? Requirements ----------------------------------------------------------------------------------
const express = require("express"); //* npm install express
const app = express();
app.set("trust proxy", 1);

async function runRoutes() {
	await require(__dirname + "/routes/differenceSSE.js")(app);
	await require(__dirname + "/routes/studentindex.js")(app);
	app.get("/ipAPI", async (req, res) => res.json(req.headers));
}

async function openPort() {
	app.listen(80, () => {
		console.log("\x1b[32m" + "Express (HTTP) opened Port" + "\x1b[0m", 80);
	});

	useMiddleware();
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

	app.use(express.static(__dirname + "/pages/dsns.dev", { dotfiles: "allow" }));

	//? 404
	app.use((req, res, next) => {
		return res.redirect("https://www.youtube.com/watch?v=dQw4w9WgXcQ");
	});
}

runRoutes().then(() => openPort());