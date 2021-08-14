require("dotenv").config();

const fs = require("fs");


async function saveStats(playerData) {
	const currentDate = new Date().toLocaleDateString("en-US", {
		hour: "numeric",
		minute: "numeric",
		hour12: true
    });
    
	const entry = {
		DSNS: {
			date: currentDate,
			finalKills: playerData[0]["stats"]["Bedwars"]["final_kills_bedwars"],
			finalDeaths: playerData[0]["stats"]["Bedwars"]["final_deaths_bedwars"],
			kills: playerData[0]["stats"]["Bedwars"]["kills_bedwars"],
			deaths: playerData[0]["stats"]["Bedwars"]["deaths_bedwars"],
			wins: playerData[0]["stats"]["Bedwars"]["wins_bedwars"],
			losses: playerData[0]["stats"]["Bedwars"]["losses_bedwars"]
		},
		jiebi: {
			date: currentDate,
			finalKills: playerData[1]["stats"]["Bedwars"]["final_kills_bedwars"],
			finalDeaths: playerData[1]["stats"]["Bedwars"]["final_deaths_bedwars"],
			kills: playerData[1]["stats"]["Bedwars"]["kills_bedwars"],
			deaths: playerData[1]["stats"]["Bedwars"]["deaths_bedwars"],
			wins: playerData[1]["stats"]["Bedwars"]["wins_bedwars"],
			losses: playerData[1]["stats"]["Bedwars"]["losses_bedwars"]
		},
		AmKale: {
			date: currentDate,
			finalKills: playerData[2]["stats"]["Bedwars"]["final_kills_bedwars"],
			finalDeaths: playerData[2]["stats"]["Bedwars"]["final_deaths_bedwars"],
			kills: playerData[2]["stats"]["Bedwars"]["kills_bedwars"],
			deaths: playerData[2]["stats"]["Bedwars"]["deaths_bedwars"],
			wins: playerData[2]["stats"]["Bedwars"]["wins_bedwars"],
			losses: playerData[2]["stats"]["Bedwars"]["losses_bedwars"]
		}
    };
    
    fs.writeFileSync("./stats.json", JSON.stringify(entry));
}

module.exports = { saveStats };
