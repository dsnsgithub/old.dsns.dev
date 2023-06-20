let gameTypes = {};
async function fetchGames() {
	gameTypes = await fetch("https://api.hypixel.net/resources/games").then((res) => res.json());
}

fetchGames();

async function sanitizeMode(game, mode) {
	const gameList = gameTypes["games"];
	//? If the game doesn't exist in the gameTypes object
	if (!gameList[game.toUpperCase()]) return [mode, game];
	const sanitizedGame = gameList[game.toUpperCase()]["name"];

	//? If the mode doesn't exist in the gameTypes object
	if (!gameList[game.toUpperCase()]?.["modeNames"]?.[mode]) return [sanitizedGame, mode];
	const sanitizedMode = gameList[game.toUpperCase()]["modeNames"][mode];

	return [sanitizedGame, sanitizedMode];
}

async function parseStatus(status, IGN) {
	if (!status["online"]) return `${IGN} is offline.`;

	const game = status["gameType"];
	const mode = status["mode"];
	const map = status["map"];

	if (mode == game || !mode) return `${IGN} is online. They are playing ${game}.`;
	if (status["mode"] == "LOBBY") return `${IGN} is online. They are in a ${game} Lobby.`;

	const [sanitizedGame, sanitizedMode] = await sanitizeMode(game, mode);
	if (map) return `${IGN} is online. They are playing ${sanitizedMode} ${sanitizedGame} on ${map}.`;
	return `${IGN} is online. They are playing ${sanitizedMode} ${sanitizedGame}.`;
}

async function parseRecentGames(recentGame) {
	if (!recentGame) return `No recent games.`;

	const recentTime = new Date(recentGame["date"]).toLocaleDateString("en-US", {
		hour: "numeric",
		minute: "numeric",
		hour12: true
	});

	const game = recentGame["gameType"];
	const mode = recentGame["mode"];
	const map = recentGame["map"] || "Unknown";

	if (!mode) return ["Unknown", game, recentTime, map];

	//? Sanitize Hypixel API into a more readable format
	const [sanitizedGame, sanitizedMode] = await sanitizeMode(recentGame["gameType"], mode);
	return [sanitizedMode, sanitizedGame, recentTime, map];
}

async function search() {
	let IGN = document.getElementById("IGN").value;

	const result = await fetch(`https://cors.dsns.dev/api.mojang.com/users/profiles/minecraft/${IGN}`).then((res) => res.json());
	if (!result["id"]) return alert("Invalid IGN");

	const uuid = result["id"];
	IGN = result["name"];

	const resultDiv = document.getElementById("result");
	resultDiv.innerText = "";

	const status = await fetch(`/api/status/${uuid}`).then((res) => res.json());
	const parsedStatus = await parseStatus(status["session"], IGN);
	resultDiv.innerHTML += `<h2 class="title">${parsedStatus}</h2>`;

	const recentGames = await fetch(`/api/recentgames/${uuid}`).then((res) => res.json());
	if (recentGames["games"].length === 0) {
		resultDiv.innerHTML += `<h1 class="title">No recent games found.</h1>`;
		return;
	}

	if (recentGames["error"]) {
		resultDiv.innerHTML += `<h1 class="title">${recentGames["error"]}</h1>`;
		return;
	}

	const table = document.createElement("table");
	table.classList = "table is-striped is-hoverable is-fullwidth";

	table.createTBody();

	for (const i in recentGames["games"]) {
		const [mode, game, time, map] = await parseRecentGames(recentGames["games"][i]);

		const row = table.insertRow();
		row.insertCell().innerText = game;
		row.insertCell().innerText = mode;
		row.insertCell().innerText = map;
		row.insertCell().innerText = time;
	}

	table.createTHead();

	const headRow = table.tHead.insertRow();
	headRow.insertCell().innerText = "Game";
	headRow.insertCell().innerText = "Mode";
	headRow.insertCell().innerText = "Map";
	headRow.insertCell().innerText = "Time";

	resultDiv.appendChild(table);
}

document.onkeyup = function (event) {
	if (event.key == "Enter") {
		event.preventDefault();
		search();
	}
};

const searchButton = document.getElementById("searchButton");
searchButton.addEventListener("click", search);
