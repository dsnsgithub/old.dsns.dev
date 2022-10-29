const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

module.exports = async function (app) {
	function getCookie(req, res) {
		try {
			const cookieRaw = req.headers.cookie;

			if (!cookieRaw) return [];
			const cookieList = {};
			const cookies = cookieRaw.split(";");
			for (const cookie of cookies) {
				let [key, value] = cookie.split("=");
				cookieList[key] = value;
			}

			return cookieList;
		} catch (e) {
			console.log(e);
			return [];
		}
	}

	function createUUID(res) {
		try {
			const database = JSON.parse(fs.readFileSync(path.resolve(__dirname + "/../json/cart.json"), "utf8"));
			const uuid = crypto.randomBytes(20).toString("hex");

			res.cookie("uuid", uuid);
			database[uuid] = [];

			fs.writeFileSync(path.resolve(__dirname + "/../json/cart.json"), JSON.stringify(database));
			return uuid;
		} catch (e) {
			console.log("Broken UUID.");
			console.log(e);
			return;
		}
	}

	app.get("/api/fetchCart", async (req, res, next) => {
		try {
			if (req.hostname != "onlyeggrolls.com" && req.hostname != "onlyeggrolls.test") return next();

			const cookies = getCookie(req, res);

			if (cookies.length <= 0) {
				createUUID(res);
				return res.json([]);
			} else {
				const database = JSON.parse(fs.readFileSync(path.resolve(__dirname + "/../json/cart.json"), "utf8"));
				const uuid = cookies["uuid"];

				if (!database?.[uuid]) {
					createUUID(res);
					return [];
				} 
				
				return res.json(database[uuid]);

			}
		} catch (e) {
			console.log(e)
			return res.status(500).send("Invalid.");
		}
	});

	app.post("/api/addCart", async (req, res, next) => {
		try {
			if (req.hostname != "onlyeggrolls.com" && req.hostname != "onlyeggrolls.test") return next();

			const cookies = getCookie(req, res);

			if (cookies.length <= 0) {
				createUUID(res);
			} else {
				const database = JSON.parse(fs.readFileSync(path.resolve(__dirname + "/../json/cart.json"), "utf8"));
				const uuid = cookies["uuid"];

				if (!database?.[uuid]) {
					createUUID(res);
					return res.status(200).send("Completed.");
				} else {
					database[uuid] = req.body;

					fs.writeFileSync(path.resolve(__dirname + "/../json/cart.json"), JSON.stringify(database));
					return res.status(200).send("Completed.");
				}
			}
		} catch (e) {
			console.log(e);
			
			return res.status(500).send("Invalid.");
		}
	});

	// takes the form field value and returns true on valid number
	function valid_credit_card(value) {
		try {
			// accept only digits, dashes or spaces
			if (value.length < 1) return false;
			if (/[^0-9-\s]+/.test(value)) return false;

			// The Luhn Algorithm. It's so pretty.
			var nCheck = 0,
				nDigit = 0,
				bEven = false;
			value = value.replace(/\D/g, "");

			for (var n = value.length - 1; n >= 0; n--) {
				var cDigit = value.charAt(n),
					nDigit = parseInt(cDigit, 10);

				if (bEven) {
					if ((nDigit *= 2) > 9) nDigit -= 9;
				}

				nCheck += nDigit;
				bEven = !bEven;
			}

			return nCheck % 10 == 0;
		} catch {
			return false;
		}
	}

	app.post("/api/purchase", async (req, res, next) => {
		try {
			if (req.hostname != "onlyeggrolls.com" && req.hostname != "onlyeggrolls.test") return next();

			if (!req.body) return res.status(400).send("No cart.");

			const cart = req.body;
			const boughtItems = [];
			let totalPrice = 0;

			let CCN = 0000;

			for (const item of cart) {
				if (item["name"] == "CCN") {
					CCN = item["number"];
					break;
				}
				if (item["name"] == "Pork Eggrolls") {
					totalPrice += 5;
					boughtItems.push(item["name"]);
				}
				if (item["name"] == "Vegetable Eggrolls") {
					totalPrice += 4;
					boughtItems.push(item["name"]);
				}
				if (item["name"] == "Beef Eggrolls") {
					totalPrice += 5;
					boughtItems.push(item["name"]);
				}
				if (item["name"] == "Shrimp Eggrolls") {
					totalPrice += 6;
					boughtItems.push(item["name"]);
				}
				if (item["name"] == "Fountain Drink") {
					totalPrice += 2;
					boughtItems.push(item["name"]);
				}
			}

			if (totalPrice > 0 && boughtItems.length > 0) {
				if (!valid_credit_card(CCN)) {
					return res.status(400).send("INVALID CREDIT CARD");
				}

				const database = JSON.parse(fs.readFileSync(path.resolve(__dirname + "/../json/orders.json"), "utf8"));
				const uuid = crypto.randomBytes(20).toString("hex");

				const transaction = {
					uuid: uuid,
					totalPrice: totalPrice,
					boughtItems: boughtItems,
					ccn: CCN
				};

				database.push(transaction);

				fs.writeFileSync(path.resolve(__dirname + "/../json/orders.json"), JSON.stringify(database));

				return res
					.status(200)
					.send(
						`Thank you for shopping at OnlyEggrolls\nThe total cost of this purchase was $${totalPrice}.\nTransaction ID: ${uuid}\nCredit Card: ${CCN}\nBought Items: ${JSON.stringify(
							boughtItems
						)}`
					);
			} else {
				return res.status(400).send("No cart.");
			}
		} catch (e) {
			console.log(e)
			return res.status(500).send("Invalid.");
		}
	});
};
