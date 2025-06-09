let gameTypes = {};
async function fetchGames() {
	gameTypes = await fetch("https://api.hypixel.net/resources/games").then((res) => res.json());
}
fetchGames();

function sanitizeMode(game, mode) {
	const gameList = gameTypes["games"];
	//? If the game doesn't exist in the gameTypes object
	if (!gameList[game.toUpperCase()]) return [mode, game];
	const sanitizedGame = gameList[game.toUpperCase()]["name"];

	//? If the mode doesn't exist in the gameTypes object
	if (!gameList[game.toUpperCase()]?.["modeNames"]?.[mode]) return [sanitizedGame, mode];
	const sanitizedMode = gameList[game.toUpperCase()]["modeNames"][mode];

	return [sanitizedGame, sanitizedMode];
}

function parseStatus(status, IGN) {
	if (!status["online"]) return `${IGN} is <span style="color: red;">offline</span>.`;

	const [game, mode] = sanitizeMode(status["gameType"], status["mode"]);
	const map = status["map"];

	if (mode == game || !mode) return `${IGN} is <span style="color: green;">online</span>. They are playing ${game}.`;
	if (status["mode"] == "LOBBY") return `${IGN} is <span style="color: green;">online</span>. They are in a ${game} Lobby.`;

	if (map) return `${IGN} is <span style="color: green;">online</span>. They are playing ${mode} ${game} on ${map}.`;
	return `${IGN} is <span style="color: green;">online</span>. They are playing ${mode} ${game}.`;
}

function parseRecentGames(recentGame) {
	if (!recentGame) return `No recent games.`;

	const startTime = new Date(recentGame["date"]).toLocaleDateString("en-US", {
		hour: "numeric",
		minute: "numeric",
		hour12: true
	});

	let endTime = "Still Playing";
	if (recentGame["ended"]) {
		endTime = new Date(recentGame["ended"]).toLocaleDateString("en-US", {
			hour: "numeric",
			minute: "numeric",
			hour12: true
		});
	}

	const mode = recentGame["mode"] || "Unknown";
	const map = recentGame["map"] || "Unknown";

	//? Sanitize Hypixel API into a more readable format
	const [sanitizedGame, sanitizedMode] = sanitizeMode(recentGame["gameType"], mode);
	return [sanitizedMode, sanitizedGame, startTime, endTime, map];
}

async function search() {
	let IGN = document.getElementById("IGN").value;

	const result = await fetch(`https://cors.dsns.dev/api.mojang.com/users/profiles/minecraft/${IGN}`).then((res) => res.json());
	if (!result["id"]) return alert("Invalid IGN");

	const uuid = result["id"];
	IGN = result["name"];

	document.getElementById("playerModel").src = `https://mc-heads.net/body/${uuid}`;
	document.getElementById("rankInformation").src = `https://hypixel.paniek.de/signature/${uuid}/general-tooltip`;
	document.getElementById("resultSection").style.display = "block";

	const statusDiv = document.getElementById("status");
	const recentGamesDiv = document.getElementById("recentGames");
	statusDiv.innerHTML = "";
	recentGamesDiv.innerHTML = "";

	const status = await fetch(`https://hypixel.dsns.dev/status/${uuid}`).then((res) => res.json());
	const parsedStatus = parseStatus(status["session"], IGN);
	statusDiv.innerHTML += `<h2 class="title">${parsedStatus}</h2>`;

	const recentGames = await fetch(`https://hypixel.dsns.dev/recentgames/${uuid}`).then((res) => res.json());
	if (recentGames["games"].length === 0) {
		recentGamesDiv.innerHTML += `<h1 class="title">No recent games found.</h1>`;
		return;
	}

	if (recentGames["error"]) {
		recentGamesDiv.innerHTML += `<h1 class="title">${recentGames["error"]}</h1>`;
		return;
	}

	const table = document.createElement("table");
	table.classList = "table is-bordered is-hoverable is-fullwidth";

	table.createTBody();

	for (const i in recentGames["games"]) {
		const [mode, game, startTime, endTime, map] = parseRecentGames(recentGames["games"][i]);

		const row = table.insertRow();
		row.insertCell().innerText = game;
		row.insertCell().innerText = mode;
		row.insertCell().innerText = map;
		row.insertCell().innerText = startTime;
		row.insertCell().innerText = endTime;
	}

	table.createTHead();

	const headRow = table.tHead.insertRow();
	headRow.insertCell().innerHTML = "<b>Game</b>";
	headRow.insertCell().innerHTML = "<b>Mode</b>";
	headRow.insertCell().innerHTML = "<b>Map</b>";
	headRow.insertCell().innerHTML = "<b>Start Time</b>";
	headRow.insertCell().innerHTML = "<b>End Time</b>";

	recentGamesDiv.appendChild(table);
}

document.onkeyup = function (event) {
	if (event.key == "Enter") {
		event.preventDefault();
		search();
	}
};

const searchButton = document.getElementById("searchButton");
searchButton.addEventListener("click", search);
