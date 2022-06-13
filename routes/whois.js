const whois = require("whois"); //* npm install whois

module.exports = function (app) {
	app.get("/api/whois/:domain", function (req, res, next) {
		if (req.hostname != "dsns.dev" && req.hostname != "dsns.test") return next();

		whois.lookup(req.params.domain, function (err, data) {
			data = data.replace(/\n/g, "<br>");
			res.send(data);
		});
	});
};
