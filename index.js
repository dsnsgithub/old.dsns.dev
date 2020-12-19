// ALSO on README.md

//! Make sure to install these modules first
// npm install hypixel-api 
// npm install express 
// npm install ejs

//! ALSO make sure to get an api key by typing "/api new" on Hypixel and replace "apikey" with the key you have.





//? Hypixel API ----------------------------------------------------------------------------
//? Grabs the Difference between AmKale and DSNS in Hypixel Levels

const HypixelAPI = require("hypixel-api");

const client = new HypixelAPI("apikey");

//? Function that onverts Hypixel EXP into Levels, since the Hypixel API doesn't supply that natively
function xpToLevel(xp) {
	// You can find the equation at, plus further help:
	// https://hypixel.net/threads/python-how-to-get-a-person%E2%80%99s-network-level-from-their-network-exp.3242392/
	return Math.sqrt(2 * xp + 30625) / 50 - 2.5;
}


// First, get DSNS's player object, and grab the player XP
client.getPlayer("name", "DSNS").then((player) => {
	// Make the XP a global variable to be able to access in a different function
	global.DSNS = xpToLevel(player.player.networkExp);
})
    .then(() => { // Wait until the async process is done, then get AmKale's player object, and grab the player XP
        client.getPlayer("name", "AmKale").then((player) => {
            // Make the XP a global variable to be able to access in a different function
			global.AmKale = xpToLevel(player.player.networkExp);
		})
            .then(() => { // Wait for the async process to end before calculating
                // Find the difference between the two levels
                var difference = global.DSNS - global.AmKale;

                // Round the difference to 3 decimal places
                var roundedDifference = difference.toFixed(3);

                // Make the result a string so it can be used on the website
				var stringDifference = roundedDifference.toString();

				//? Express Web Server ----------------------------------------------------------------------------
                //? This webserver will take the result from the API and display it on a webpage when accessed

                //? Express is used for the webserver itself
				var express = require("express");
				var app = express();

                //? Ejs is an engine to take variables from node.js and put them in HTML
                // Allows Express to interact with Ejs
				app.set("view engine", "ejs");

                // This will run when a request is sent to the server
                app.get("/", function (req, res) {
                    // Send the ejs file to the engine, so it can create a HTML file
                    // Ejs will send a reply to the user
                    res.render("index", {
                        // Specifies the variables we want to bring over
						difference: stringDifference,
					});
				});

                // Make the Express server wait for port 80 requests
                app.listen(80);
                
                //Notify the console that the server is hosted on port 80
				console.log("Express server is hosting on Port 80");
			});
	});


