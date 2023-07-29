import { Express, Request, Response } from "express";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";

import fs from "fs";
import path from "path";
import crypto from "crypto";

dotenv.config();

interface CookieList {
	[key: string]: string;
}

interface Account {
	email: string;
	uuid: string;
	password: string;
	CCN: string;
	CVV: string;
	address: string;
	zipCode: string;
	fullName: string;
}

interface Billing {
	uuid: string;
	password: string;
	CCN: string;
	CVV: string;
	address: string;
	zipCode: string;
	fullName: string;
}

interface Order {
	totalPrice: number;
	boughtItems: string;
	CCN: string;
	CVV: string;
	address: string;
	zipCode: string;
	fullName: string;
}

interface Item {
	name: string;
	quantity: number;
	cost: number;
}

interface ShoppingCart {
	porkEggroll: Item;
	vegetableEggroll: Item;
	beefEggroll: Item;
	shrimpEggroll: Item;
	fountainDrink: Item;
	Billing: Billing;
}

interface LoginDatabase {
	[key: string]: Billing;
}

interface CartDatabase {
	[key: string]: ShoppingCart;
}

interface OrdersDatabase {
	[key: string]: Array<Order>;
}

interface VerifyDatabase {
	[key: string]: Account;
}

module.exports = function (app: Express) {
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
	} as ShoppingCart;

	//? Helper Functions -----------------------------------------------
	function getCookie(req: Request, res: Response) {
		try {
			const cookieRaw = req.headers.cookie;

			if (!cookieRaw) return [];
			const cookieList: CookieList = {};
			const cookies = cookieRaw.split(";");
			for (const cookie of cookies) {
				let [key, value] = cookie.split("=");
				cookieList[key] = value;
			}

			return cookieList;
		} catch (error: any) {
			console.error("\x1b[31m" + "Error: Broken getCookie(): " + (error.stack || error) + "\x1b[0m");
			return null;
		}
	}

	function createUUID(res: Response) {
		try {
			const cartDatabase: CartDatabase = JSON.parse(fs.readFileSync(path.resolve(__dirname + "/../json/cart.json"), "utf8"));
			const uuid = crypto.randomBytes(20).toString("hex");

			res.cookie("uuid", uuid);
			cartDatabase[uuid] = defaultCart;

			fs.writeFileSync(path.resolve(__dirname + "/../json/cart.json"), JSON.stringify(cartDatabase));
			return uuid;
		} catch (error: any) {
			console.error("\x1b[31m" + "Error: Broken createUUID(): " + (error.stack || error) + "\x1b[0m");
			return "";
		}
	}

	function validateCreditCard(CCN: string) {
		try {
			if (CCN.length < 1) return false;
			if (/[^0-9-\s]+/.test(CCN)) return false;

			let nCheck = 0;
			let bEven = false;
			CCN = CCN.replace(/\D/g, "");

			for (let i = CCN.length - 1; i >= 0; i--) {
				const cDigit = CCN.charAt(i);
				let nDigit = parseInt(cDigit, 10);

				if (bEven) {
					if ((nDigit *= 2) > 9) nDigit -= 9;
				}

				nCheck += nDigit;
				bEven = !bEven;
			}

			return nCheck % 10 == 0;
		} catch (error: any) {
			console.error("\x1b[31m" + "Error: Broken validateCreditCard(): " + (error.stack || error) + "\x1b[0m");
			return false;
		}
	}

	async function createAccount(req: Request, res: Response, uuid: string) {
		const verifyDatabase: VerifyDatabase = JSON.parse(fs.readFileSync(path.resolve(__dirname + "/../json/verify.json"), "utf8"));

		//? Sign up - creates new UUID and assigns the UUID to the email submitted
		const saltedPassword = await bcrypt.hash(req.body["password"], 10);

		if (!req.body["CCN"] || !req.body["CVV"] || !req.body["address"] || !req.body["zipCode"] || !req.body["fullName"]) return res.status(400).send("Missing credit card information.");

		const code = crypto.randomBytes(20).toString("hex");

		verifyDatabase[code] = {
			email: req.body["email"],
			uuid: uuid,
			password: saltedPassword,
			CCN: req.body["CCN"], // credit card number
			CVV: req.body["CVV"], // CVV/CVC code (the 3 digit number on the back of the card)
			address: req.body["address"],
			zipCode: req.body["zipCode"],
			fullName: req.body["fullName"]
		};

		const transporter = nodemailer.createTransport({
			host: "smtp.gmail.com",
			port: 587,
			auth: {
				user: process.env["googleEmail"],
				pass: process.env["googlePass"]
			}
		});

		await transporter.sendMail({
			from: process.env["smtpEmail"],
			to: req.body["email"],
			subject: "OnlyEggrolls Verification",
			text: `Click this link to create an account on onlyeggrolls.com: https://onlyeggrolls.test/verify/${code}`
		});

		fs.writeFileSync(path.resolve(__dirname + "/../json/verify.json"), JSON.stringify(verifyDatabase));
		return res.status(200).send("A verification email was sent to: " + req.body["email"]);
	}

	async function verifyAccount(req: Request, res: Response) {
		const cookies = getCookie(req, res) as CookieList;
		const loginDatabase: LoginDatabase = JSON.parse(fs.readFileSync(path.resolve(__dirname + "/../json/login.json"), "utf8"));
		const verifyDatabase: VerifyDatabase = JSON.parse(fs.readFileSync(path.resolve(__dirname + "/../json/verify.json"), "utf8"));

		const code = req.params.code;
		const email = verifyDatabase[code]["email"];
		loginDatabase[email] = {
			uuid: cookies["uuid"],
			password: verifyDatabase[code]["password"],
			CCN: verifyDatabase[code]["CCN"],
			CVV: verifyDatabase[code]["CVV"],
			address: verifyDatabase[code]["address"],
			zipCode: verifyDatabase[code]["zipCode"],
			fullName: verifyDatabase[code]["fullName"]
		};

		delete verifyDatabase[code];

		fs.writeFileSync(path.resolve(__dirname + "/../json/login.json"), JSON.stringify(loginDatabase));
		fs.writeFileSync(path.resolve(__dirname + "/../json/verify.json"), JSON.stringify(verifyDatabase));

		return res.redirect("/finalize");
	}

	//? API Endpoints ----------------------------------------------------------------------------------------------------------------------------------------------
	app.get("/api/fetchCart", async (req, res, next) => {
		try {
			if (req.hostname != "onlyeggrolls.com" && req.hostname != "onlyeggrolls.test") return next();

			const cookies = getCookie(req, res) as CookieList;
			if (!cookies) return res.status(400).send("Missing cookies.");

			if (Number(cookies.length) <= 0) {
				createUUID(res);
				return res.json(defaultCart);
			} else {
				const cartDatabase: CartDatabase = JSON.parse(fs.readFileSync(path.resolve(__dirname + "/../json/cart.json"), "utf8"));
				const uuid = cookies["uuid"];

				if (!cartDatabase?.[uuid]) {
					const loginDatabase: LoginDatabase = JSON.parse(fs.readFileSync(path.resolve(__dirname + "/../json/login.json"), "utf8"));

					for (const user in loginDatabase) {
						if (loginDatabase[user]["uuid"] == cookies["uuid"]) {
							cartDatabase[uuid] = defaultCart;
							fs.writeFileSync(path.resolve(__dirname + "/../json/cart.json"), JSON.stringify(cartDatabase));

							return res.json(cartDatabase[uuid]);
						}
					}

					createUUID(res);
					return res.json(defaultCart);
				}

				return res.json(cartDatabase[uuid]);
			}
		} catch (error: any) {
			console.error("\x1b[31m" + "Error: Broken (GET) /api/fetchCart: " + (error.stack || error) + "\x1b[0m");
			return res.status(500).send(error);
		}
	});

	app.post("/api/addCart", async (req, res, next) => {
		try {
			if (req.hostname != "onlyeggrolls.com" && req.hostname != "onlyeggrolls.test") return next();

			const cookies = getCookie(req, res) as CookieList;

			if (Number(cookies.length) <= 0) {
				createUUID(res);
			} else {
				const cartDatabase: CartDatabase = JSON.parse(fs.readFileSync(path.resolve(__dirname + "/../json/cart.json"), "utf8"));
				const uuid = cookies["uuid"];

				if (!cartDatabase?.[uuid]) {
					createUUID(res);
					return res.status(200).send("Completed.");
				} else {
					cartDatabase[uuid] = req.body;

					fs.writeFileSync(path.resolve(__dirname + "/../json/cart.json"), JSON.stringify(cartDatabase));
					return res.status(200).send("Completed.");
				}
			}
		} catch (error: any) {
			console.error("\x1b[31m" + "Error: Broken (POST) /api/addCart: " + (error.stack || error) + "\x1b[0m");
			return res.status(500).send(error);
		}
	});

	app.post("/api/purchase", async (req, res, next) => {
		try {
			if (req.hostname != "onlyeggrolls.com" && req.hostname != "onlyeggrolls.test") return next();
			if (!req.body) return res.status(400).send("No cart."); //? Shopping cart is sent through POST body

			const shoppingCart = req.body as ShoppingCart;
			let boughtItems = ""; //? string that lists everything the user bought
			let totalPrice = 0;

			for (const item in defaultCart) {
				const cartItem = item as keyof ShoppingCart;
				if (cartItem == "Billing") continue; //? payment information is attached as an item in the shopping cart at the end

				if (shoppingCart[cartItem].quantity > 0) {
					totalPrice += defaultCart[cartItem].cost * shoppingCart[cartItem].quantity;
					boughtItems += `${defaultCart[cartItem]["name"]} (${shoppingCart[cartItem].quantity}), `;
				}
			}

			if (totalPrice <= 0 || boughtItems.length <= 0) return res.status(400).send("No cart.");
			boughtItems = boughtItems.slice(0, -2); //? removes the ", " at the end of the last item

			const cookies = getCookie(req, res) as CookieList;
			if (Number(cookies.length) <= 0 || !cookies["uuid"]) return res.status(400).send("Invalid Cookie");

			let paymentInfo = shoppingCart["Billing"];
			if (!validateCreditCard(paymentInfo["CCN"])) return res.status(400).send("Invalid Credit Card");

			const ordersDatabase: OrdersDatabase = JSON.parse(fs.readFileSync(path.resolve(__dirname + "/../json/orders.json"), "utf8"));
			if (!ordersDatabase[cookies["uuid"]]) ordersDatabase[cookies["uuid"]] = [];
			if (!paymentInfo["CCN"] || !paymentInfo["CVV"] || !paymentInfo["address"] || !paymentInfo["zipCode"] || !paymentInfo["fullName"]) {
				return res.status(400).send("Missing credit card information.");
			}

			ordersDatabase[cookies["uuid"]].push({
				totalPrice: totalPrice,
				boughtItems: boughtItems,
				CCN: paymentInfo["CCN"],
				CVV: paymentInfo["CVV"],
				address: paymentInfo["address"],
				zipCode: paymentInfo["zipCode"],
				fullName: paymentInfo["fullName"]
			});

			fs.writeFileSync(path.resolve(__dirname + "/../json/orders.json"), JSON.stringify(ordersDatabase));

			const message =
				`Thank you for shopping at OnlyEggrolls.\n` +
				`The total cost of this purchase was $${totalPrice}.\n\n` +
				`Cookie: ${cookies["uuid"]}\n` +
				`Credit Card: ${paymentInfo["CCN"]}\n` +
				`Bought Items: ${JSON.stringify(boughtItems)}`;

			//! NO EMAIL RESPONSE due to spam concerns
			const loginDatabase: LoginDatabase = JSON.parse(fs.readFileSync(path.resolve(__dirname + "/../json/login.json"), "utf8"));

			let email = "";
			for (const user in loginDatabase) {
				if (loginDatabase[user]["uuid"] == cookies["uuid"]) {
					email = user;
					break;
				}
			}

			const transporter = nodemailer.createTransport({
				host: "smtp.gmail.com",
				port: 587,
				auth: {
					user: process.env["googleEmail"],
					pass: process.env["googlePass"]
				}
			});

			await transporter.sendMail({
				from: process.env["smtpEmail"],
				to: email,
				subject: "OnlyEggrolls Order",
				text: message
			});

			return res.status(200).send(message);
		} catch (error: any) {
			console.error("\x1b[31m" + "Error: Broken (POST) /api/purchase: " + (error.stack || error) + "\x1b[0m");
			return res.status(500).send(error);
		}
	});

	app.get("/api/fetchOrders", async (req, res, next) => {
		try {
			if (req.hostname != "onlyeggrolls.com" && req.hostname != "onlyeggrolls.test") return next();
			const cookies = getCookie(req, res) as CookieList;

			if (Number(cookies.length) <= 0) {
				createUUID(res);
				return res.json([]);
			} else {
				const ordersDatabase: OrdersDatabase = JSON.parse(fs.readFileSync(path.resolve(__dirname + "/../json/orders.json"), "utf8"));
				const uuid = cookies["uuid"];

				if (!ordersDatabase?.[uuid]) {
					return res.json([]);
				}

				return res.json(ordersDatabase[uuid]);
			}
		} catch (error: any) {
			console.error("\x1b[31m" + "Error: Broken (GET) /api/fetchOrders: " + (error.stack || error) + "\x1b[0m");
			return res.status(500).send(error);
		}
	});

	app.post("/api/signup", async (req, res, next) => {
		try {
			if (req.hostname != "onlyeggrolls.com" && req.hostname != "onlyeggrolls.test") return next();
			const loginDatabase: LoginDatabase = JSON.parse(fs.readFileSync(path.resolve(__dirname + "/../json/login.json"), "utf8"));
			if (!req.body["email"] || !req.body["password"]) return res.status(400).send("Please enter both a username and password.");

			//? Sign up - creates new UUID and assigns the UUID to the email submitted
			if (!loginDatabase[req.body["email"]]) {
				const cookies = getCookie(req, res) as CookieList;
				if (Number(cookies.length) <= 0 || !cookies["uuid"]) {
					return await createAccount(req, res, createUUID(res));
				} else {
					return await createAccount(req, res, cookies["uuid"]);
				}
			}

			const compare = await bcrypt.compare(req.body["password"], loginDatabase[req.body["email"]]["password"]);
			if (!compare) return res.status(400).send("Incorrect password.");

			res.cookie("uuid", loginDatabase[req.body["email"]]["uuid"]);
			return res.status(200).send("Logged in as: " + req.body["email"]);
		} catch (error: any) {
			console.error("\x1b[31m" + "Error: Broken (POST) /api/signup: " + (error.stack || error) + "\x1b[0m");
			return res.status(500).send(error);
		}
	});

	app.get("/verify/:code", async (req, res, next) => {
		try {
			if (req.hostname != "onlyeggrolls.com" && req.hostname != "onlyeggrolls.test") return next();

			const verifyDatabase: VerifyDatabase = JSON.parse(fs.readFileSync(path.resolve(__dirname + "/../json/verify.json"), "utf8"));

			if (verifyDatabase[req.params.code]) {
				return await verifyAccount(req, res);
			} else {
				return res.status(400).send("Incorrect verification code.");
			}
		} catch (error: any) {
			console.error("\x1b[31m" + "Error: Broken (GET) /api/verify: " + (error.stack || error) + "\x1b[0m");
			return res.status(500).send(error);
		}
	});

	app.get("/api/accountInfo", async (req, res, next) => {
		try {
			if (req.hostname != "onlyeggrolls.com" && req.hostname != "onlyeggrolls.test") return next();

			const cookies = getCookie(req, res) as CookieList;
			if (Number(cookies.length) <= 0 || !cookies["uuid"]) return res.redirect("/menu");

			const loginDatabase = JSON.parse(fs.readFileSync(path.resolve(__dirname + "/../json/login.json"), "utf8"));
			for (const user in loginDatabase) {
				if (loginDatabase[user]["uuid"] == cookies["uuid"]) {
					return res.json({
						email: user,
						CCN: loginDatabase[user]["CCN"],
						CVV: loginDatabase[user]["CVV"],
						address: loginDatabase[user]["address"],
						zipCode: loginDatabase[user]["zipCode"],
						fullName: loginDatabase[user]["fullName"]
					});
				}
			}

			return res.status(400).send("Username not found.");
		} catch (error: any) {
			console.error("\x1b[31m" + "Error: Broken (GET) /api/accountInfo: " + (error.stack || error) + "\x1b[0m");
			return res.status(500).send(error);
		}
	});
};
