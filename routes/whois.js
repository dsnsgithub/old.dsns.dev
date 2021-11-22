const whois = require("whois");
module.exports = function (app) {
	app.get("/whoisAPI/:domain", function (req, res) {
		whois.lookup(req.params.domain, function (err, data) {
			data = data.replace(/\n/g, "<br>");
			res.send(data);
		});
	});
};
