// @ts-check
require("dotenv").config();

//? Requirements
const hypixel = require("../scripts/hypixel.js");

module.exports = async function (app) {
	app.get("/recentAPI/:IGN", async (req, res) => {
		try {
			const IGN = req.params.IGN;
			const response = await hypixel.getRecentGames(IGN);

			return res.json(response);
		} catch (error) {
			return res.json({ error: error.message });
		}
	});
};
