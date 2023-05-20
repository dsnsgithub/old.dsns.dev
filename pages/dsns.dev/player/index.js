const gameTypes = {
	success: true,
	lastUpdated: 1639513102971,
	games: {
		QUAKECRAFT: {
			modeNames: {
				teams: "Teams",
				solo: "Solo",
				solo_tourney: "Solo (Tournament)"
			},
			legacy: true,
			databaseName: "Quake",
			name: "Quakecraft",
			id: 2
		},
		SKYCLASH: {
			databaseName: "SkyClash",
			name: "SkyClash",
			retired: true,
			id: 55
		},
		BUILD_BATTLE: {
			modeNames: {
				BUILD_BATTLE_HALLOWEEN: "Halloween Hyper",
				BUILD_BATTLE_CHRISTMAS_NEW_TEAMS: "Holiday Teams",
				BUILD_BATTLE_SOLO_NORMAL_LATEST: "Solo (1.14+)",
				BUILD_BATTLE_GUESS_THE_BUILD: "Guess The Build",
				BUILD_BATTLE_TEAMS_NORMAL: "Teams",
				BUILD_BATTLE_SOLO_NORMAL: "Solo",
				BUILD_BATTLE_SOLO_PRO: "Pro",
				BUILD_BATTLE_CHRISTMAS_NEW_SOLO: "Holiday Solo",
				BUILD_BATTLE_CHRISTMAS: "Christmas"
			},
			databaseName: "BuildBattle",
			name: "Build Battle",
			id: 60
		},
		UHC: {
			databaseName: "UHC",
			name: "UHC Champions",
			id: 20
		},
		LEGACY: {
			databaseName: "Legacy",
			name: "Classic Games",
			id: 56
		},
		SKYBLOCK: {
			modeNames: {
				farming_1: "The Farming Islands",
				crystal_hollows: "Crystal Hollows",
				foraging_1: "Floating Islands",
				dark_auction: "Dark Auction",
				dungeon: "Dungeons",
				combat_3: "The End",
				hub: "Hub",
				dynamic: "Private Island",
				mining_3: "Dwarven Mines",
				mining_1: "Gold Mine",
				combat_2: "Blazing Fortress",
				mining_2: "Deep Caverns",
				combat_1: "Spider\u0027s Den"
			},
			databaseName: "SkyBlock",
			name: "SkyBlock",
			id: 63
		},
		HOUSING: {
			databaseName: "Housing",
			name: "Housing",
			id: 26
		},
		MCGO: {
			databaseName: "MCGO",
			name: "Cops and Crims",
			id: 21
		},
		SURVIVAL_GAMES: {
			databaseName: "HungerGames",
			name: "Blitz Survival Games",
			id: 5
		},
		BATTLEGROUND: {
			databaseName: "Battleground",
			name: "Warlords",
			id: 23
		},
		MURDER_MYSTERY: {
			modeNames: {
				MURDER_DOUBLE_UP: "Double Up",
				MURDER_INFECTION: "Infection",
				MURDER_ASSASSINS: "Assassins",
				MURDER_CLASSIC: "Classic"
			},
			databaseName: "MurderMystery",
			name: "Murder Mystery",
			id: 59
		},
		ARCADE: {
			databaseName: "Arcade",
			modeNames: {
				HOLE_IN_THE_WALL: "Hole in the Wall",
				SOCCER: "Football",
				ONEINTHEQUIVER: "Bounty Hunters",
				DRAW_THEIR_THING: "Pixel Painters",
				DRAGONWARS2: "Dragon Wars",
				ENDER: "Ender Spleef",
				STARWARS: "Galaxy Wars",
				THROW_OUT: "Throw Out",
				DEFENDER: "Creeper Attack",
				party_games: "Party Games",
				PARTY: "Party Games",
				PARTY_2: "Party Games",
				PARTY_3: "Party Games",
				FARM_HUNT: "Farm Hunt",
				hypixel_says: "Hypixel Says",
				SIMON_SAYS: "Hypixel Says",
				SANTA_SAYS: "Santa Says",
				GRINCH: "Grinch Simulator",
				MINI_WALLS: "Mini Walls",
				DAYONE: "Blocking Dead",
				ZOMBIES: "Zombies",
				ZOMBIES_BAD_BLOOD: "Zombies",
				ZOMBIES_DEAD_END: "Zombies",
				ZOMBIES_ALIEN_ARCADIUM: "Zombies",
				HIDE_AND_SEEK: "Hide and Seek",
				HIDE_AND_SEEK_PARTY_POOPER: "Party Pooper",
				HIDE_AND_SEEK_PROP_HUNT: "Prop Hunt",
				EASTER_SIMULATOR: "Easter Simulator",
				PVP_CTW: "Capture The Wool"
			},
			name: "Arcade",
			id: 14
		},
		ARENA: {
			legacy: true,
			databaseName: "Arena",
			name: "Arena Brawl",
			id: 17
		},
		TNTGAMES: {
			modeNames: {
				TEAMS_NORMAL: "Teams Mode",
				PVPRUN: "PVP Run",
				TNTAG: "TNT Tag",
				TNTRUN_TOURNEY: "TNT Run Tourney",
				TNTRUN: "TNT Run",
				BOWSPLEEF: "Bow Spleef",
				CAPTURE: "Wizards"
			},
			databaseName: "TNTGames",
			name: "TNT Games",
			id: 6
		},
		WALLS: {
			legacy: true,
			databaseName: "Walls",
			name: "Walls",
			id: 3
		},
		SKYWARS: {
			modeNames: {
				solo_insane_lucky: "Solo Lucky Block",
				solo_insane_slime: "Solo Slime",
				teams_insane_slime: "Teams Slime",
				teams_insane_rush: "Teams Rush",
				teams_insane_lucky: "Teams Lucky Block",
				solo_normal: "Solo Normal",
				teams_insane: "Teams Insane",
				solo_insane_hunters_vs_beasts: "Solo Hunters vs Beasts",
				ranked_normal: "Ranked",
				solo_insane_tnt_madness: "Solo TNT Madness",
				mega_doubles: "Mega Doubles",
				solo_insane_rush: "Solo Rush",
				solo_insane: "Solo Insane",
				teams_insane_tnt_madness: "Teams TNT Madness",
				teams_normal: "Teams Normal",
				mega_normal: "Mega"
			},
			databaseName: "SkyWars",
			name: "SkyWars",
			id: 51
		},
		VAMPIREZ: {
			legacy: true,
			databaseName: "VampireZ",
			name: "VampireZ",
			id: 7
		},
		PROTOTYPE: {
			modeNames: {
				PIXEL_PARTY: "Pixel Party",
				INVADERS: "Invaders",
				TOWERWARS_SOLO: "TowerWars - Solo",
				TOWERWARS_TEAM_OF_TWO: "TowerWars - Teams of Two"
			},
			databaseName: "Prototype",
			name: "Prototype",
			id: 57
		},
		WALLS3: {
			databaseName: "Walls3",
			name: "Mega Walls",
			id: 13
		},
		BEDWARS: {
			modeNames: {
				BEDWARS_TWO_FOUR: "4v4",
				BEDWARS_EIGHT_ONE: "Solo",
				BEDWARS_FOUR_FOUR_RUSH: "Rush 4v4v4v4",
				BEDWARS_EIGHT_TWO_RUSH: "Rush Doubles",
				BEDWARS_EIGHT_TWO_VOIDLESS: "Voidless Doubles",
				BEDWARS_FOUR_FOUR_ARMED: "Armed 4v4v4v4",
				BEDWARS_EIGHT_TWO_ARMED: "Armed Doubles",
				BEDWARS_EIGHT_TWO_UNDERWORLD: "Underworld Doubles",
				BEDWARS_EIGHT_TWO_SWAP: "Swappage Doubles",
				BEDWARS_EIGHT_TWO: "Doubles",
				BEDWARS_FOUR_FOUR: "4v4v4v4",
				BEDWARS_FOUR_FOUR_UNDERWORLD: "Underworld 4v4v4v4",
				BEDWARS_EIGHT_ONE_RUSH: "Rush Solo",
				BEDWARS_FOUR_FOUR_ULTIMATE: "Ultimate 4v4v4v4",
				BEDWARS_EIGHT_TWO_LUCKY: "Lucky Doubles",
				BEDWARS_FOUR_FOUR_SWAP: "Swappage 4v4v4v4",
				BEDWARS_FOUR_THREE: "3v3v3v3",
				BEDWARS_FOUR_FOUR_VOIDLESS: "Voidless 4v4v4v4",
				BEDWARS_FOUR_FOUR_LUCKY: "Lucky 4v4v4v4",
				BEDWARS_CASTLE: "Castle",
				BEDWARS_EIGHT_ONE_ULTIMATE: "Ultimate Solo",
				BEDWARS_EIGHT_TWO_ULTIMATE: "Ultimate Doubles"
			},
			databaseName: "Bedwars",
			name: "Bed Wars",
			id: 58
		},
		PAINTBALL: {
			legacy: true,
			databaseName: "Paintball",
			name: "Paintball",
			id: 4
		},
		SUPER_SMASH: {
			databaseName: "SuperSmash",
			name: "Smash Heroes",
			id: 24
		},
		SMP: {
			databaseName: "SMP",
			name: "SMP",
			id: 67
		},
		REPLAY: {
			databaseName: "Replay",
			name: "Replay",
			id: 65
		},
		TRUE_COMBAT: {
			databaseName: "TrueCombat",
			name: "Crazy Walls",
			retired: true,
			id: 52
		},
		PIT: {
			databaseName: "Pit",
			name: "Pit",
			id: 64
		},
		SPEED_UHC: {
			databaseName: "SpeedUHC",
			modeNames: {
				solo_normal: "Solo Normal",
				solo_insane: "Solo Insane",
				teams_normal: "Teams Normal",
				teams_insane: "Teams Insane"
			},
			name: "Speed UHC",
			id: 54
		},
		DUELS: {
			modeNames: {
				DUELS_BOWSPLEEF_DUEL: "Bow Spleef",
				DUELS_BOW_DUEL: "Bow",
				DUELS_MW_DUEL: "MegaWalls",
				DUELS_UHC_FOUR: "UHC Teams",
				DUELS_UHC_MEETUP: "UHC Deathmatch",
				DUELS_SW_DOUBLES: "SkyWars Doubles",
				DUELS_UHC_DOUBLES: "UHC Doubles",
				DUELS_SW_FOUR: "SkyWars 4v4",
				DUELS_BRIDGE_FOUR: "Bridge 4v4",
				DUELS_SUMO_DUEL: "Sumo",
				DUELS_BRIDGE_THREES: "Bridge 3v3",
				DUELS_OP_DUEL: "OP",
				DUELS_MW_DOUBLES: "MegaWalls Doubles",
				DUELS_SUMO_TOURNAMENT: "Sumo Championship",
				DUELS_DUEL_ARENA: "Duel Arena",
				DUELS_COMBO_DUEL: "Combo",
				DUELS_BRIDGE_2V2V2V2: "Bridge 2v2v2v2",
				DUELS_BRIDGE_DOUBLES: "Bridge Doubles",
				DUELS_BRIDGE_TOURNAMENT: "Bridge Championship",
				DUELS_BOXING_DUEL: "Boxing",
				DUELS_UHC_DUEL: "UHC",
				DUELS_BRIDGE_3V3V3V3: "Bridge 3v3v3v3",
				DUELS_UHC_TOURNAMENT: "UHC Championship",
				DUELS_OP_DOUBLES: "OP Doubles",
				DUELS_PARKOUR_EIGHT: "Parkour",
				DUELS_CAPTURE_THREES: "Bridge CTF 3v3",
				DUELS_BLITZ_DUEL: "Blitz",
				DUELS_MW_FOUR: "MegaWalls Teams",
				DUELS_CLASSIC_DUEL: "Classic",
				DUELS_POTION_DUEL: "NoDebuff",
				DUELS_BRIDGE_DUEL: "Bridge",
				DUELS_SW_TOURNAMENT: "SkyWars Championship",
				DUELS_SW_DUEL: "SkyWars"
			},
			databaseName: "Duels",
			name: "Duels",
			id: 61
		},
		GINGERBREAD: {
			databaseName: "GingerBread",
			name: "Turbo Kart Racers",
			id: 25
		}
	}
};

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

	const game = status["game"]["name"];
	const mode = status["mode"];

	if (mode == game || !mode) return `${IGN} is online. They are playing ${game}.`;
	if (status["mode"] == "LOBBY") return `${IGN} is online. They are in a ${game} Lobby.`;

	const [sanitizedGame, sanitizedMode] = await sanitizeMode(game, mode);
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

async function run() {
	let IGN = document.getElementById("IGN").value;

	const result = await fetch(`/api/ignConvert/${IGN}`).then((res) => res.json());
	if (!result["id"]) return alert("Invalid IGN");

	const uuid = result["id"];
	IGN = result["name"];

	const resultDiv = document.getElementById("result");
	resultDiv.innerText = "";

	const status = await fetch(`/api/status/${uuid}`).then((res) => res.json());
	const parsedStatus = await parseStatus(status, IGN);
	resultDiv.innerHTML += `<h2 class="title">${parsedStatus}</h2>`;

	const recentGames = await fetch(`/api/recentgames/${uuid}`).then((res) => res.json());
	if (recentGames["games"].length === 0) {
		resultDiv.innerHTML = `<h1 class="title">No recent games found.</h1>`;
		return;
	}

	if (recentGames["error"]) {
		resultDiv.innerHTML = `<h1 class="title">${recentGames["error"]}</h1>`;
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
		run();
	}
};

const searchButton = document.getElementById("searchButton");
searchButton.addEventListener("click", run);
