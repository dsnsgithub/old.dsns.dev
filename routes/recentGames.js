// @ts-check

//? Requirements
const hypixel = require("../scripts/hypixel.js");

module.exports = async function (app) {
	app.get("/api/recentgames/:IGN", async (req, res, next) => {
		if (req.hostname != "dsns.dev" && req.hostname != "dsns.test") return next();

		try {
			const IGN = req.params.IGN;
			const response = await hypixel.getRecentGames(IGN);

			return res.json(response);
		} catch (error) {
			return res.json({ error: error.message });
		}
	});
};
