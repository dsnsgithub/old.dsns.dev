const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
require("dotenv").config();

module.exports = async function (app) {
	//? Useful Constants -----------------------------------------------
	const defaultCart = {
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
	};

	//? Helper Functions -----------------------------------------------
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
		} catch (error) {
			console.error("\x1b[31m" + "Error: Broken getCookie(): " + (error.stack || error) + "\x1b[0m");
			return null;
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
		} catch (error) {
			console.error("\x1b[31m" + "Error: Broken createUUID(): " + (error.stack || error) + "\x1b[0m");
			return null;
		}
	}

	function validateCreditCard(value) {
		try {
			if (value.length < 1) return false;
			if (/[^0-9-\s]+/.test(value)) return false;

			let nCheck = 0;
			let bEven = false;
			value = value.replace(/\D/g, "");

			for (let i = value.length - 1; i >= 0; i--) {
				const cDigit = value.charAt(i);
				let nDigit = parseInt(cDigit, 10);

				if (bEven) {
					if ((nDigit *= 2) > 9) nDigit -= 9;
				}

				nCheck += nDigit;
				bEven = !bEven;
			}

			return nCheck % 10 == 0;
		} catch (error) {
			console.error("\x1b[31m" + "Error: Broken validateCreditCard(): " + (error.stack || error) + "\x1b[0m");
			return false;
		}
	}

	async function createAccount(req, res, uuid, database) {
		//? Sign up - creates new UUID and assigns the UUID to the email submitted
		const saltedPassword = await bcrypt.hash(req.body["password"], 10);

		if (!req.body["CCN"] || !req.body["CVV"] || !req.body["address"] || !req.body["zipCode"] || !req.body["fullName"]) return res.status(400).send("Missing credit card information.");

		database[req.body["email"]] = {
			uuid: uuid,
			password: saltedPassword,
			CCN: req.body["CCN"], // credit card number
			CVV: req.body["CVV"], // CVV/CVC code (the 3 digit number on the back of the card)
			address: req.body["address"],
			zipCode: req.body["zipCode"],
			fullName: req.body["fullName"]
		};

		fs.writeFileSync(path.resolve(__dirname + "/../json/login.json"), JSON.stringify(database));
		return res.status(200).send("Created New Account & UUID: " + database[req.body["email"]]["uuid"]);
	}

	app.get("/api/fetchCart", async (req, res, next) => {
		try {
			if (req.hostname != "onlyeggrolls.com" && req.hostname != "onlyeggrolls.test") return next();

			const cookies = getCookie(req, res);
			if (cookies.length <= 0) {
				createUUID(res);
				return res.json(defaultCart);
			} else {
				const database = JSON.parse(fs.readFileSync(path.resolve(__dirname + "/../json/cart.json"), "utf8"));
				const uuid = cookies["uuid"];

				if (!database?.[uuid]) {
					createUUID(res);
					return res.json(defaultCart);
				}

				return res.json(database[uuid]);
			}
		} catch (error) {
			console.error("\x1b[31m" + "Error: Broken (GET) /api/fetchCart: " + (error.stack || error) + "\x1b[0m");
			return res.status(500).send(error);
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
		} catch (error) {
			console.error("\x1b[31m" + "Error: Broken (POST) /api/addCart: " + (error.stack || error) + "\x1b[0m");
			return res.status(500).send(error);
		}
	});

	app.post("/api/purchase", async (req, res, next) => {
		try {
			if (req.hostname != "onlyeggrolls.com" && req.hostname != "onlyeggrolls.test") return next();
			if (!req.body) return res.status(400).send("No cart."); //? Shopping cart is sent through POST body

			const shoppingCart = req.body;
			let boughtItems = ""; //? string that lists everything the user bought
			let totalPrice = 0;

			for (const item in shoppingCart) {
				if (item == "Billing") continue; //? payment information is attached as an item in the shopping cart at the end
				totalPrice += defaultCart[item].cost * shoppingCart[item].quantity;
				boughtItems += `${defaultCart[item]["name"]} (${shoppingCart[item].quantity}), `;
			}

			if (totalPrice <= 0 || boughtItems.length <= 0) return res.status(400).send("No cart.");
			boughtItems = boughtItems.slice(0, -2); //? removes the ", " at the end of the last item

			const cookies = getCookie(req, res);
			if (cookies.length <= 0 || !cookies["uuid"]) return res.status(400).send("Invalid Cookie");

			let paymentInfo = shoppingCart["Billing"];
			if (!validateCreditCard(paymentInfo["CCN"])) return res.status(400).send("Invalid Credit Card");

			const ordersDatabase = JSON.parse(fs.readFileSync(path.resolve(__dirname + "/../json/orders.json"), "utf8"));
			if (!ordersDatabase[cookies["uuid"]]) ordersDatabase[cookies["uuid"]] = [];
			if (!paymentInfo["CCN"] || !paymentInfo["CVV"] || !paymentInfo["address"] || !paymentInfo["zipCode"] || !paymentInfo["fullName"]) {
				return res.status(400).send("Missing credit card information.");
			}

			ordersDatabase[cookies["uuid"]].push({
				totalPrice: totalPrice,
				boughtItems: boughtItems,
				ccn: paymentInfo["CCN"],
				CVV: paymentInfo["CVV"],
				address: paymentInfo["address"],
				zipCode: paymentInfo["zipCode"],
				fullName: paymentInfo["fullName"]
			});

			fs.writeFileSync(path.resolve(__dirname + "/../json/orders.json"), JSON.stringify(ordersDatabase));

			const message =
				`Thank you for shopping at OnlyEggrolls\n` +
				`The total cost of this purchase was $${totalPrice}\n` +
				`Cookie: ${cookies["uuid"]}\n` +
				`Credit Card: ${paymentInfo["CCN"]}\n` +
				`Bought Items: ${JSON.stringify(boughtItems)}`;

			const database = JSON.parse(fs.readFileSync(path.resolve(__dirname + "/../json/login.json"), "utf8"));

			let email = "";
			for (const user in database) {
				if (database[user]["uuid"] == cookies["uuid"]) {
					email = user;
					break;
				}
			}

			// create transporter object with smtp server details
			const transporter = nodemailer.createTransport({
				host: "smtp.gmail.com",
				port: 587,
				auth: {
					user: process.env["googleEmail"],
					pass: process.env["googlePass"]
				}
			});

			// send email
			await transporter.sendMail({
				from: process.env["smtpEmail"],
				to: email,
				subject: "OnlyEggrolls Order",
				text: message
			});

			return res.status(200).send(message);
		} catch (error) {
			console.error("\x1b[31m" + "Error: Broken (POST) /api/purchase: " + (error.stack || error) + "\x1b[0m");
			return res.status(500).send(error);
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
		} catch (error) {
			console.error("\x1b[31m" + "Error: Broken (GET) /api/fetchOrders: " + (error.stack || error) + "\x1b[0m");
			return res.status(500).send(error);
		}
	});

	app.post("/api/signup", async (req, res, next) => {
		try {
			if (req.hostname != "onlyeggrolls.com" && req.hostname != "onlyeggrolls.test") return next();
			const cookies = getCookie(req, res);

			const database = JSON.parse(fs.readFileSync(path.resolve(__dirname + "/../json/login.json"), "utf8"));
			if (!req.body["email"] || !req.body["password"]) return res.status(400).send("Please enter both a username and password.");

			//? Sign up - creates new UUID and assigns the UUID to the email submitted
			if (!database[req.body["email"]]) {
				if (cookies.length <= 0 || !cookies["uuid"]) {
					return await createAccount(req, res, createUUID(res), database);
				} else {
					return await createAccount(req, res, cookies["uuid"], database);
				}
			}

			const compare = await bcrypt.compare(req.body["password"], database[req.body["email"]]["password"]);
			if (!compare) return res.status(400).send("Incorrect password.");

			res.cookie("uuid", database[req.body["email"]]["uuid"]);
			return res.status(200).send("Logged in as: " + req.body["email"]);
		} catch (error) {
			console.error("\x1b[31m" + "Error: Broken (POST) /api/signup: " + (error.stack || error) + "\x1b[0m");
			return res.status(500).send(error);
		}
	});

	app.get("/api/accountInfo", async (req, res, next) => {
		try {
			if (req.hostname != "onlyeggrolls.com" && req.hostname != "onlyeggrolls.test") return next();

			const cookies = getCookie(req, res);
			if (cookies.length <= 0 || !cookies["uuid"]) return res.redirect("/menu");

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
		} catch (error) {
			console.error("\x1b[31m" + "Error: Broken (GET) /api/accountInfo: " + (error.stack || error) + "\x1b[0m");
			return res.status(500).send(error);
		}
	});
};
