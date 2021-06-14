async function getQuests(playerName) {
	let playerQuests = await fetch(`https://api.slothpixel.me/api/players/${playerName}/quests`).then((response) => response.json());

	let dsns = document.getElementById("dsns");
	let jiebi = document.getElementById("jiebi");
	let amkale = document.getElementById("amkale");

	for (const i in playerQuests["completions"]) {
		let length = playerQuests["completions"][i].length - 1;

		if (length < 0) {
			continue;
		} else {
			let date = new Date(playerQuests["completions"][i][length]).toLocaleDateString("en-US", {
				hour: "numeric",
				minute: "numeric",
				hour12: true
			});

			if (playerName == "DSNS") {
				dsns.innerHTML = dsns.innerHTML + "<br>" + `${playerName}: ${i}: ${date}`;
			}

			if (playerName == "jiebi") {
				jiebi.innerHTML = jiebi.innerHTML + "<br>" + `${playerName}: ${i}: ${date}`;
			}

			if (playerName == "AmKale") {
				amkale.innerHTML = amkale.innerHTML + "<br>" + `${playerName}: ${i}: ${date}`;
			}
		}
	}
}

getQuests("DSNS");
getQuests("AmKale");
getQuests("jiebi");
