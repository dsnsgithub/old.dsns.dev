// @ts-check
const hypixel = require("../scripts/createSSEData.js");

module.exports = async function (app) {
	let result = await hypixel.createDifferenceSSE();
	setInterval(async () => {
		result = await hypixel.createDifferenceSSE();
	}, Number(process.env.RELOAD_TIME));

	app.get("/differenceData", async (req, res) => {
		res.set({
			"Cache-Control": "no-cache",
			"Content-Type": "text/event-stream",
			"Access-Control-Allow-Origin": "*",
			Connection: "keep-alive"
		});
		res.flushHeaders();

		//? Send data to client every minute
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
