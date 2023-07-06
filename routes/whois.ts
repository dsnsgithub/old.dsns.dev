import whois from "whois-json";
import { Express } from "express";

module.exports = function (app: Express) {
	app.get("/api/whois/:domain", async (req, res, next) => {
		try {
			if (req.hostname != "dsns.dev" && req.hostname != "dsns.test") return next();

			const results = await whois(req.params.domain);
			return res.json(results);
		} catch (error: any) {
			console.error("\x1b[31m" + "Error: Broken (GET) /api/whois: " + (error.stack || error) + "\x1b[0m");
			return res.status(500).send(error);
		}
	});
};
