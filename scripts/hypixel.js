// @ts-check
require("dotenv").config();

try {
	const HypixelAPIReborn = require("hypixel-api-reborn");
	const hypixel = new HypixelAPIReborn.Client(process.env.API_KEY, { cache: true });

	module.exports = hypixel;
} catch (error) {
	console.error("\x1b[31m" + "Hypixel API Key Error: " + (error.stack || error) + "\x1b[0m");
}
