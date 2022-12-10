const hypixel = require("./createSSEData.js");

module.exports = async function (app) {
	const UUIDs = process.env["UUIDs"].split(", ");
	const IGNs = process.env["IGNs"].split(", ");

	let result = await hypixel.createDifferenceSSE(UUIDs, IGNs);
	setInterval(async () => {
		result = await hypixel.createDifferenceSSE(UUIDs, IGNs);
	}, Number(process.env.RELOAD_TIME));

	app.get("/api/difference", async (req, res, next) => {
		if (req.hostname != "dsns.dev" && req.hostname != "dsns.test" && !req.hostname.match(/(^10\.)|(^192\.168\.)/)) return next();

		res.json(result);
	});
};
