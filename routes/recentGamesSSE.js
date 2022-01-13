// @ts-check
const hypixel = require("../scripts/createSSEData.js");

module.exports = async function (app) {
	const UUIDs = process.env["UUIDs"].split(", ");

	let result = await hypixel.createRecentGamesSSE(UUIDs);
	setInterval(async () => {
		result = await hypixel.createRecentGamesSSE(UUIDs);
	}, Number(process.env.RELOAD_TIME));

	app.get("/recentGamesData", async (req, res) => {
		res.json(result);
	});
};
