// @ts-check
const bcrypt = require("bcrypt");
const express = require("express"); //* npm install express
const fs = require("fs");
const crypto = require("crypto");
const path = require("path");

module.exports = function (app) {
    app.use(express.urlencoded({ extended: false }));

	async function passwordProtector(email, password) {
		let database = JSON.parse(fs.readFileSync(__dirname + "/../json/passwords.json", "utf8"));
		const saltedPassword = await bcrypt.hash(password, 10);

		database[email] = saltedPassword;

		fs.writeFileSync(__dirname + "/../json/passwords.json", JSON.stringify(database));

		return saltedPassword;
	}

    app.post("/create", async (req, res) => {
        // Verify that the user is permitted to create an account
		let codes = JSON.parse(fs.readFileSync(__dirname + "/../json/codes.json", "utf8"));
        let code = req.body["code"];

		if (codes.indexOf(code) == -1) {
			return res.status(401).send(`<h1>You must enter the correct code to create a new account. Codes can be created by other people that create one for you.</h1><img src="https://http.cat/401"><br><a href="/studentindex">Back</a>`);
        }
        
        codes.splice(codes.indexOf(code), 1);
		fs.writeFileSync(__dirname + "/../json/codes.json", JSON.stringify(codes));
        

		let database = JSON.parse(fs.readFileSync(__dirname + "/../json/passwords.json", "utf8"));

		const email = req.body["email"];
		if (!email) {
            return res.status(400)
                .send(`<h1>No Email Given</h1><img src="https://http.cat/400"><br><a href="/studentindex">Back</a>`);
		}
		const password = req.body["password"];
		if (!password) {
            return res.status(400)
                .send(`<h1>No Password Given</h1><img src="https://http.cat/400"><br><a href="/studentindex">Back</a>`);
		}

		if (database[email]) {
            return res.status(400)
                .send(`<h1>Account Already Created</h1><img src="https://http.cat/400"><br><a href="/studentindex">Back</a>`);
		}

		await passwordProtector(email, password);
        res.status(201)
            .send(`<h1>You have created the email login ${email.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</h1><img src="https://http.cat/201"><br><a href="/studentindex">Back</a>`);
	});

	app.post("/checkpassword", async (req, res) => {
		const database = JSON.parse(fs.readFileSync(__dirname + "/../json/passwords.json", "utf8"));

		const email = req.body["email"];
		if (!email) {
            return res.status(400)
                .send(`<h1>No Email Given</h1><img src="https://http.cat/400"><br><a href="/studentindex">Back</a>`);
		}

		const password = req.body["password"];
		if (!password) {
            return res.status(400)
                .send(`<h1>No Password Given</h1><img src="https://http.cat/400"><br><a href="/studentindex">Back</a>`);
		}

		bcrypt.compare(password, database[email], function (err, result) {
            if (result) {
                const action = req.body["action"];

                if (action == "login") {
                    return res.sendFile(path.resolve(__dirname + "/../pages/private/studentindex.html"));
                }
                if (action == "create") {
                    const newCode = crypto.randomBytes(8).toString("hex");

		            let codes = JSON.parse(fs.readFileSync(__dirname + "/../json/codes.json", "utf8"));
                    codes.push(newCode);

                    fs.writeFileSync(__dirname + "/../json/codes.json", JSON.stringify(codes));

                    return res
						.status(201)
						.send(
							`<h1>New Code Created: ${newCode}</h1> <br> <a href="/studentindex/createAccount.html">Link to Create Account</a> <br> <a href="/studentindex">Back</a> <br> <img src="https://http.cat/201">`
						);
                }

            } else {
                return res.status(401)
                    .send(`<h1>Invalid Password</h1><img src="https://http.cat/401"><br><a href="/studentindex">Back</a>`);
			}
		});
	});
};
