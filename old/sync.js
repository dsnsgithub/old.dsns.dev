//! Program Settings ------------------------------------
const port = 8080; 
const apiKey = "82994cf3-5124-464c-a6e4-c5e6fcf22c18";
const reloadTime = 60000;
const localhost = false;

//? Refresh the cache ------------------------------------------------------------

setTimeout(function () {
	return process.exit(22);
}, reloadTime);


//? Requirements -------------------------------------------------------------
const HypixelAPI = require("hypixel-api");
const client = new HypixelAPI(apiKey);

const fs = require("fs");
const levels = require("./levels");

const express = require("express");
const app = express();
app.set("view engine", "ejs");

//? Functions ---------------------------------------------------------------------------------------


function xpToLevel(xp) {
	// https://hypixel.net/threads/python-how-to-get-a-person%E2%80%99s-network-level-from-their-network-exp.3242392/
	return Math.sqrt(2 * xp + 30625) / 50 - 2.5;
}


//? Grabs levels from Hypixel API -------------------------------------------------------------------------------
client.getPlayer("name", "DSNS").then((player) => {
    global.DSNS = xpToLevel(player.player.networkExp);
})
    .then(() => {
	    client.getPlayer("name", "AmKale").then((player) => {
            global.AmKale = xpToLevel(player.player.networkExp);
        })
            .then(() => {
                client.getPlayer("name", "jiebi").then((player) => {
                    global.jiebi = xpToLevel(player.player.networkExp);
                })
                    .then(() => {
						var differenceAmKale = global.DSNS - global.AmKale;
						var differenceJiebi = global.DSNS - global.jiebi;

						//? Adding to JSON --------------------------------------------------------------------------
						let entry = {
							date: new Date().toLocaleTimeString("en-US", {
								hour: "numeric",
								minute: "numeric",
								hour12: true,
							}),
							dsnsLevel: global.DSNS,
							differenceAmKale: differenceAmKale,
							differenceJiebi: differenceJiebi
						};

						levels.push(entry);

						fs.writeFile(
							"levels.json",
							JSON.stringify(levels),
							(err) => {
								if (err) throw err;
								console.log("Wrote to levels.json");
							}
						);

						//? Creating graph array for Google Charts -----------------------------------------

						AmKaleGraphArray = [];
						//graphArray.push(["Time", "AmKale", "DSNS", "jiebi"]);
						AmKaleGraphArray.push([
							"Time",
							"Difference between DSNS and AmKale",
						]);

						for (i = 0; i < levels.length; i++) {
							AmKaleGraphArray.push([
								levels[i].date,
								levels[i].differenceAmKale,
							]);
						}

						jiebiGraphArray = [];

						jiebiGraphArray.push([
							"Time",
							"Difference between DSNS and jiebi",
						]);

						for (i = 0; i < levels.length; i++) {
							jiebiGraphArray.push([
								levels[i].date,
								levels[i].differenceJiebi,
							]);
						}

						//? Running Express Server ------------------------------------------------------------------
						app.get("/", function (req, res) {
							res.render("index", {
								differenceAmKale: differenceAmKale.toFixed(3).toString(),
								differenceJiebi: differenceJiebi.toFixed(3).toString(),
								AmKaleGraphArray: JSON.stringify(AmKaleGraphArray),
								jiebiGraphArray: JSON.stringify(jiebiGraphArray),
								reloadTime: reloadTime.toString(),
								date: new Date(),
							});
						});

						if (localhost == true) {
							app.listen(port);
							console.log("Express server is hosting on Port", port);
                        } 
                        
                        if (localhost == false) { 
                            // ? HTTPS -------------------------------------------------------------
                            const http = require("http");
                            const https = require("https");

                            const privateKey = fs.readFileSync('/etc/letsencrypt/live/adamsai.com/privkey.pem', 'utf8');
                            const certificate = fs.readFileSync('/etc/letsencrypt/live/adamsai.com/cert.pem', 'utf8');
                            const ca = fs.readFileSync('/etc/letsencrypt/live/adamsai.com/chain.pem', 'utf8');

                            const credentials = {
	                            key: privateKey,
	                            cert: certificate,
	                            ca: ca,
                            };

                            const httpServer = http.createServer(app);
                            const httpsServer = https.createServer(credentials, app);
                            
							httpServer.listen(port, () => {
								console.log("HTTP Server running on port", port);
							});
							httpsServer.listen(443, () => {
								console.log("HTTPS Server running on port 443");
							});
						}
					});
                
			});
	});
