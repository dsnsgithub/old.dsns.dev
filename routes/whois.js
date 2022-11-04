const whois = require("whois"); //* npm install whois

module.exports = function (app) {
	app.get("/api/whois/:domain", function (req, res, next) {
		try {
			if (req.hostname != "dsns.dev" && req.hostname != "dsns.test") return next();

			whois.lookup(req.params.domain, function (err, data) {
				data = data.replace(/\n/g, "<br>");
				res.send(data);
			});
		} catch (error) {
			console.error("\x1b[31m" + "Error: Broken (GET) /api/whois: " + (error.stack || error) + "\x1b[0m");
			return res.status(500).send(error);
		}
	});
};
