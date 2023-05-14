require("dotenv").config(); //* npm install dotenv

const axios = require("axios");
axios.defaults.validateStatus = function (status) {
	return true;
};

const fs = require("fs");
const database = require(`${__dirname}/../json/difference.json`);

const round = (number, decimalPlaces) => {
	const factorOfTen = Math.pow(10, decimalPlaces);
	return Math.round(number * factorOfTen) / factorOfTen;
};

const xpToLevel = (xp) => {
	return round(Math.sqrt(2 * xp + 30625) / 50 - 2.5, 3);
};

module.exports = function (app) {
	async function updateDatabase(reloadAll) {
		for (const uuid in database) {
			const result = await axios.get(`https://api.hypixel.net/player?key=${process.env["API_KEY"]}&uuid=${uuid}`);

			const xpLevel = xpToLevel(result["data"]["player"]["networkExp"]);
			const lastIndex = database[uuid].length - 1;

			if (!reloadAll) {
				if (lastIndex != -1) {
					if (database[uuid][lastIndex]["level"] == xpLevel) {
						continue;
					}
				}
			}
			
			database[uuid].push({
				date: new Date().toLocaleDateString("en-US", {
					hour: "numeric",
					minute: "numeric",
					hour12: true
				}),
				level: xpLevel
			});
		}

		return fs.writeFileSync(`${__dirname}/../json/difference.json`, JSON.stringify(database));
	}

	updateDatabase(false);
	setInterval(() => { updateDatabase(false); }, process.env["RELOAD_TIME"]);

	app.get("/api/history/:uuid", async function (req, res, next) {
		try {
			if (req.hostname != "dsns.dev" && req.hostname != "dsns.test") return next();

			const result = await axios.get(`https://sessionserver.mojang.com/session/minecraft/profile/${req.params.uuid}`);

			if (database[req.params.uuid]) {
				res.json([result["data"]["name"], database[req.params.uuid]]);
			} else {
				if (!result["data"]["name"]) {
					res.json({ error: "UUID doesn't exist." });
				} else {
					database[req.params.uuid] = [];
					fs.writeFileSync(`${__dirname}/../json/difference.json`, JSON.stringify(database));

					await updateDatabase(true);

					res.json(database[req.params.uuid]);
				}
			}
		} catch (error) {
			console.error("\x1b[31m" + "Error: Broken (GET) /api/history: " + (error.stack || error) + "\x1b[0m");
			return res.status(500).send(error);
		}
	});

	app.get("/api/recentgames/:uuid", async function (req, res, next) {
		try {
			if (req.hostname != "dsns.dev" && req.hostname != "dsns.test") return next();
			const result = await axios.get(`https://api.hypixel.net/recentgames?key=${process.env["API_KEY"]}&uuid=${req.params.uuid}`);
			res.json(result.data);
		} catch (error) {
			console.error("\x1b[31m" + "Error: Broken (GET) /api/recentgames: " + (error.stack || error) + "\x1b[0m");
			return res.status(500).send(error);
		}
	});

	app.get("/api/status/:uuid", async function (req, res, next) {
		try {
			if (req.hostname != "dsns.dev" && req.hostname != "dsns.test") return next();

			const result = await axios.get(`https://api.hypixel.net/status?key=${process.env["API_KEY"]}&uuid=${req.params.uuid}`);
			res.json(result.data);
		} catch (error) {
			console.error("\x1b[31m" + "Error: Broken (GET) /api/status: " + (error.stack || error) + "\x1b[0m");
			return res.status(500).send(error);
		}
	});

	app.get("/api/uuidConvert/:uuid", async function (req, res, next) {
		try {
			if (req.hostname != "dsns.dev" && req.hostname != "dsns.test") return next();

			const result = await axios.get(`https://sessionserver.mojang.com/session/minecraft/profile/${req.params.uuid}`);
			res.json(result.data);
		} catch (error) {
			console.error("\x1b[31m" + "Error: Broken (GET) /api/status: " + (error.stack || error) + "\x1b[0m");
			return res.status(500).send(error);
		}
	});

	app.get("/api/ignConvert/:ign", async function (req, res, next) {
		try {
			if (req.hostname != "dsns.dev" && req.hostname != "dsns.test") return next();

			const result = await axios.get(`https://api.mojang.com/users/profiles/minecraft/${req.params.ign}`);
			res.json(result.data);
		} catch (error) {
			console.error("\x1b[31m" + "Error: Broken (GET) /api/status: " + (error.stack || error) + "\x1b[0m");
			return res.status(500).send(error);
		}
	});
};
