// @ts-check
const bcrypt = require("bcrypt");
const express = require("express"); //* npm install express
const fs = require("fs");
const crypto = require("crypto");
const path = require("path");

module.exports = function (app) {
	//? Allows form-encoded data to be sent to the server
	app.use(express.urlencoded({ extended: false }));

	async function passwordProtector(email, password) {
		let database = JSON.parse(fs.readFileSync(__dirname + "/../json/passwords.json", "utf8"));
		const saltedPassword = await bcrypt.hash(password, 10);

		database[email] = saltedPassword;

		fs.writeFileSync(__dirname + "/../json/passwords.json", JSON.stringify(database));
		return saltedPassword;
	}

    app.post("/create", async (req, res) => {
		const database = JSON.parse(fs.readFileSync(__dirname + "/../json/passwords.json", "utf8"));
		const codes = JSON.parse(fs.readFileSync(__dirname + "/../json/codes.json", "utf8"));

		//? Verify that the user has the correct code to create an account
		const code = req.body["code"];

		if (codes.indexOf(code) == -1) {
			return res.status(412).sendFile(path.resolve(__dirname + "/../pages/dsns.dev/studentindex/412.html"));
		}

		//? Remove the one time code from the list of codes
		codes.splice(codes.indexOf(code), 1);
		fs.writeFileSync(__dirname + "/../json/codes.json", JSON.stringify(codes));

		//? Verify the user entered an email and password
		const email = req.body["email"];
		const password = req.body["password"];
		if (!email || !password) {
			return res.status(400).sendFile(path.resolve(__dirname + "/../pages/dsns.dev/studentindex/400.html"));
		}

		//? Verify if the email already exists in the database
		if (database[email]) {
			return res.status(403).sendFile(path.resolve(__dirname + "/../pages/dsns.dev/studentindex/403.html"));
		}

		//? Create a new account
		await passwordProtector(email, password);
		return res
			.status(201)
			.send(`<h1>You have created the email login ${email.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</h1><img src="https://http.cat/201"><br><a href="/studentindex">Back</a>`);
	});

	app.post("/checkpassword", async (req, res) => {
		const database = JSON.parse(fs.readFileSync(__dirname + "/../json/passwords.json", "utf8"));

		//? Verify if the user entered an email
		const email = req.body["email"];
		const password = req.body["password"];
		if (!email || !password) {
			return res.status(400).sendFile(path.resolve(__dirname + "/../pages/dsns.dev/studentindex/400.html"));
		}

		//? Check if the bcrypt hash matches the password
        bcrypt.compare(password, database[email], (err, result) => {
            //? If incorrect password:
			if (!result) return res.status(401).sendFile(path.resolve(__dirname + "/../pages/dsns.dev/studentindex/401.html"));

			const action = req.body["action"];

			if (action == "login") {
				return res.sendFile(path.resolve(__dirname + "/../pages/private/studentindex.html"));
			}
			if (action == "create") {
				//? Create a new one time code
				const newCode = crypto.randomBytes(8).toString("hex");

				let codes = JSON.parse(fs.readFileSync(__dirname + "/../json/codes.json", "utf8"));
				codes.push(newCode);

				fs.writeFileSync(__dirname + "/../json/codes.json", JSON.stringify(codes));

				//? Send the code to the user
				return res
					.status(201)
					.send(
						`<h1>New Code Created: ${newCode}</h1> <img src="https://http.cat/201"> <br> <a href="/studentindex/createAccount.html">Link to Create Account</a> <br> <a href="/studentindex">Back</a>`
					);
			}
		});
	});
};
