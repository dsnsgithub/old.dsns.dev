// @ts-check
const hypixel = require("../scripts/createSSEData.js");

module.exports = async function (app) {
	const UUIDs = process.env["UUIDs"].split(", ");
	const IGNs = process.env["IGNs"].split(", ");

	let result = await hypixel.createDifferenceSSE(UUIDs, IGNs);
	setInterval(async () => {
		result = await hypixel.createDifferenceSSE(UUIDs, IGNs);
	}, Number(process.env.RELOAD_TIME));

	app.get("/differenceData", async (req, res) => {
		res.set({
			"Cache-Control": "no-cache",
			"Content-Type": "text/event-stream",
			Connection: "keep-alive"
		});

		res.flushHeaders();

		res.write(`data: ${JSON.stringify(result)} \n\n`);
		const sendEvent = setInterval(() => {
			res.write(`data: ${JSON.stringify(result)} \n\n`);
		}, Number(process.env.RELOAD_TIME));

		//? If client closes connection, stop sending events
		res.on("close", () => {
			clearInterval(sendEvent);
			res.end();
		});
	});
};
