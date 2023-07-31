import { Express } from "express";
import dotenv from "dotenv";
import axios from "axios";

import fs from "fs";
import _data from "../json/levels.json";

dotenv.config();

// axios rejects promise if status code is not 200, fixed
axios.defaults.validateStatus = (status) => {
	return true;
};

export interface Database {
	[key: string]: { date: string; level: number }[];
}
const database: Database = _data;

const round = (number: number, decimalPlaces: number) => {
	const factorOfTen = Math.pow(10, decimalPlaces);
	return Math.round(number * factorOfTen) / factorOfTen;
};

const xpToLevel = (xp: number) => {
	return round(Math.sqrt(2 * xp + 30625) / 50 - 2.5, 2);
};

async function updateDatabase() {
	try {
		for (const uuid in database) {
			const result = await axios.get(`https://api.hypixel.net/player?uuid=${uuid}`, {
				headers: { "API-Key": process.env["API_KEY"] }
			});

			const xpLevel = xpToLevel(result["data"]["player"]["networkExp"]);
			const lastIndex = database[uuid].length - 1;

			if (lastIndex != -1) {
				if (database[uuid][lastIndex]["level"] == xpLevel) {
					continue;
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

		return fs.writeFileSync(`${__dirname}/../json/levels.json`, JSON.stringify(database));
	} catch (error: any) {
		console.error("\x1b[31m" + "Error: Unable to update database: " + (error.stack || error) + "\x1b[0m");
		return fs.writeFileSync(`${__dirname}/../json/levels.json`, JSON.stringify(database));
	}
}

updateDatabase();
setInterval(updateDatabase, Number(process.env["RELOAD_TIME"]));

module.exports = function (app: Express) {
	app.get("/api/history/:uuid", async (req, res, next) => {
		try {
			if (req.hostname != "dsns.dev" && req.hostname != "dsns.test") return next();

			if (database[req.params.uuid]) return res.json(database[req.params.uuid]);

			const result = await axios.get(`https://sessionserver.mojang.com/session/minecraft/profile/${req.params.uuid}`);
			if (!result["data"]["name"]) return res.status(400).json({ error: "UUID doesn't exist." });

			database[req.params.uuid] = [];
			fs.writeFileSync(`${__dirname}/../json/levels.json`, JSON.stringify(database));

			await updateDatabase();
			return res.json(database[req.params.uuid]);
		} catch (error: any) {
			console.error("\x1b[31m" + "Error: Broken (GET) /api/history: " + (error.stack || error) + "\x1b[0m");
			return res.status(500).send(error);
		}
	});
};
