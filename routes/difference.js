const hypixel = require("../scripts/createSSEData.js");

module.exports = async function (app) {
	const UUIDs = process.env["UUIDs"].split(", ");
	const IGNs = process.env["IGNs"].split(", ");

	let result = await hypixel.createDifferenceSSE(UUIDs, IGNs);
	setInterval(async () => {
		result = await hypixel.createDifferenceSSE(UUIDs, IGNs);
	}, Number(process.env.RELOAD_TIME));

	app.get("/api/difference", async (req, res, next) => {
		if (req.hostname != "dsns.dev" && req.hostname != "dsns.test") return next();

		res.set({
			"Cache-Control": "no-cache",
			"Content-Type": "text/event-stream",
			Connection: "keep-alive"
		});

		res.send(`data: ${JSON.stringify(result)} \n\n`);
	});
};
