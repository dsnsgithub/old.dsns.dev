// @ts-check
const hypixel = require("../scripts/createRecentGamesSSE.js");

module.exports = async function (app) {
	const recentData = await hypixel.createRecentGamesSSE();
	app.get("/recentGamesData", async (req, res) => {
		res.json(recentData);
	});
};



