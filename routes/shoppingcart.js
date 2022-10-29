const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const bcrypt = require("bcrypt");

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
				return res.json({
					porkEggroll: {
						name: "Pork Eggrolls",
						quantity: 0,
						cost: 5
					},
					vegetableEggroll: {
						name: "Vegetable Eggrolls",
						quantity: 0,
						cost: 4
					},
					beefEggroll: {
						name: "Beef Eggrolls",
						quantity: 0,
						cost: 5
					},
					shrimpEggroll: {
						name: "Shrimp Eggrolls",
						quantity: 0,
						cost: 6
					},
					fountainDrink: {
						name: "Fountain Drink",
						quantity: 0,
						cost: 2
					}
				});
			} else {
				const database = JSON.parse(fs.readFileSync(path.resolve(__dirname + "/../json/cart.json"), "utf8"));
				const uuid = cookies["uuid"];

				if (!database?.[uuid]) {
					createUUID(res);
					return res.json({
						porkEggroll: {
							name: "Pork Eggrolls",
							quantity: 0,
							cost: 5
						},
						vegetableEggroll: {
							name: "Vegetable Eggrolls",
							quantity: 0,
							cost: 4
						},
						beefEggroll: {
							name: "Beef Eggrolls",
							quantity: 0,
							cost: 5
						},
						shrimpEggroll: {
							name: "Shrimp Eggrolls",
							quantity: 0,
							cost: 6
						},
						fountainDrink: {
							name: "Fountain Drink",
							quantity: 0,
							cost: 2
						}
					});
				}

				return res.json(database[uuid]);
			}
		} catch (e) {
			console.log(e);
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
			let boughtItems = "";
			let totalPrice = 0;

			let paymentInformation = cart["Billing"];

			const priceList = {
				porkEggroll: {
					name: "Pork Eggrolls",
					cost: 5
				},
				vegetableEggroll: {
					name: "Vegetable Eggrolls",
					cost: 4
				},
				beefEggroll: {
					name: "Beef Eggrolls",
					cost: 5
				},
				shrimpEggroll: {
					name: "Shrimp Eggrolls",
					cost: 6
				},
				fountainDrink: {
					name: "Fountain Drink",
					cost: 2
				}
			};

			for (const item in cart) {
				if (item == "Billing") continue;
				totalPrice += priceList[item].cost * cart[item].quantity;
				boughtItems += `${priceList[item]["name"]} (${cart[item].quantity}), `;
			}

			boughtItems = boughtItems.slice(0, -2);

			if (totalPrice > 0 && boughtItems.length > 0) {
				const cookies = getCookie(req, res);

				if (cookies.length <= 0 || !cookies["uuid"]) {
					return res.status(400).send("Can't order without valid cookie.");
				}

				if (!valid_credit_card(paymentInformation["CCN"])) {
					return res.status(400).send("INVALID CREDIT CARD");
				}

				const ordersDatabase = JSON.parse(fs.readFileSync(path.resolve(__dirname + "/../json/orders.json"), "utf8"));

				if (!ordersDatabase[cookies["uuid"]]) {
					ordersDatabase[cookies["uuid"]] = [];
				}

				if (!paymentInformation["CCN"] || !paymentInformation["CVV"] || !paymentInformation["address"] || !paymentInformation["zipCode"] || !paymentInformation["fullName"]) {
					return res.status(400).send("Missing credit card information.");
				}

				ordersDatabase[cookies["uuid"]].push({
					totalPrice: totalPrice,
					boughtItems: boughtItems,
					ccn: paymentInformation["CCN"],
					CVV: paymentInformation["CVV"],
					address: paymentInformation["address"],
					zipCode: paymentInformation["zipCode"],
					fullName: paymentInformation["fullName"]
				});

				fs.writeFileSync(path.resolve(__dirname + "/../json/orders.json"), JSON.stringify(ordersDatabase));

				return res
					.status(200)
					.send(
						`Thank you for shopping at OnlyEggrolls\nThe total cost of this purchase was $${totalPrice}.\nCookie: ${cookies["uuid"]}\nCredit Card: ${
							paymentInformation["CCN"]
						}\nBought Items: ${JSON.stringify(boughtItems)}`
					);
			} else {
				return res.status(400).send("No cart.");
			}
		} catch (e) {
			console.log(e);
			return res.status(500).send("Invalid.");
		}
	});

	app.get("/api/fetchOrders", async (req, res, next) => {
		try {
			if (req.hostname != "onlyeggrolls.com" && req.hostname != "onlyeggrolls.test") return next();

			const cookies = getCookie(req, res);

			if (cookies.length <= 0) {
				createUUID(res);
				return res.json([]);
			} else {
				const database = JSON.parse(fs.readFileSync(path.resolve(__dirname + "/../json/orders.json"), "utf8"));

				const uuid = cookies["uuid"];

				if (!database?.[uuid]) {
					createUUID(res);
					return res.json([]);
				}

				return res.json(database[uuid]);
			}
		} catch (e) {
			console.log(e);
			return res.status(500).send("Invalid");
		}
	});

	app.post("/api/signup", async (req, res, next) => {
		if (req.hostname != "onlyeggrolls.com" && req.hostname != "onlyeggrolls.test") return next();

		const cookies = getCookie(req, res);

		if (cookies.length <= 0 || !cookies["uuid"]) {
			const database = JSON.parse(fs.readFileSync(path.resolve(__dirname + "/../json/login.json"), "utf8"));

			if (!req.body["email"] || !req.body["password"]) return res.status(400).send("Please enter both a username and password.");

			if (!database[req.body["email"]]) {
				// Sign up - creates new UUID and assigns the UUID to the email submitted
				const saltedPassword = await bcrypt.hash(req.body["password"], 10);

				const uuid = createUUID(res);
				database[req.body["email"]] = {
					uuid: uuid,
					password: saltedPassword
				};
			} else {
				// Login - if they already have an account, and they enter the correct password, they recieve the cookie uuid

				const compare = await bcrypt.compare(req.body["password"], database[req.body["email"]]["password"]);
				if (!compare) {
					return res.status(400).send("Incorrect password.");
				}

				res.cookie("uuid", database[req.body["email"]]["uuid"]);
			}

			fs.writeFileSync(path.resolve(__dirname + "/../json/login.json"), JSON.stringify(database));
			return res.status(200).send("Updated UUID:" + database[req.body["email"]]["uuid"]);
		} else {
			const database = JSON.parse(fs.readFileSync(path.resolve(__dirname + "/../json/login.json"), "utf8"));
			if (!req.body["email"] || !req.body["password"]) return res.status(400).send("Please enter both a username and password.");

			if (!database[req.body["email"]]) {
				// Sign up - creates new UUID and assigns the UUID to the email submitted
				const saltedPassword = await bcrypt.hash(req.body["password"], 10);

				const uuid = cookies["uuid"];

				const CCN = req.body["CCN"]; // credit card number
				const CVV = req.body["CVV"]; // CVV/CVC code (the 3 digit number on the back of the card)
				const address = req.body["address"];
				const zipCode = req.body["zipCode"];
				const fullName = req.body["fullName"];

				if (!CCN || !CVV || !address || !zipCode || !fullName) return res.status(400).send("Missing credit card information.");

				database[req.body["email"]] = {
					uuid: uuid,
					password: saltedPassword,
					CCN: CCN,
					CVV: CVV,
					address: address,
					zipCode: zipCode,
					fullName: fullName
				};

				fs.writeFileSync(path.resolve(__dirname + "/../json/login.json"), JSON.stringify(database));

				return res.status(200).send("Created account linked to UUID:" + JSON.stringify(database[req.body["email"]]["uuid"]) + "\nCreated email: " + req.body["email"]);
			} else {
				const compare = await bcrypt.compare(req.body["password"], database[req.body["email"]]["password"]);
				if (!compare) {
					return res.status(400).send("Incorrect password.");
				}

				res.cookie("uuid", database[req.body["email"]]["uuid"]);
				return res.status(200).send("Logged in as: " + req.body["email"]);
			}
		}
	});

	app.get("/api/accountInfo", async (req, res, next) => {
		if (req.hostname != "onlyeggrolls.com" && req.hostname != "onlyeggrolls.test") return next();

		const cookies = getCookie(req, res);

		if (cookies.length <= 0 || !cookies["uuid"]) {
			return res.redirect("/menu");
		}

		const database = JSON.parse(fs.readFileSync(path.resolve(__dirname + "/../json/login.json"), "utf8"));

		for (const user in database) {
			if (database[user]["uuid"] == cookies["uuid"]) {
				return res.json({
					email: user,
					CCN: database[user]["CCN"],
					CVV: database[user]["CVV"],
					address: database[user]["address"],
					zipCode: database[user]["zipCode"],
					fullName: database[user]["fullName"]
				});
			}
		}

		return res.status(400).send("Username not found.");
	});
};
