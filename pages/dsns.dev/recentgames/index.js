const gameTypes = {
	SMP: {
		name: "SMP",
		games: {}
	},
	REPLAY: {
		name: "Replay Viewer",
		games: {}
	},
	LIMBO: {
		name: "Limbo",
		games: {}
	},
	MAIN: {
		name: "Main Lobby",
		games: {}
	},
	TOURNAMENT: {
		name: "Tournament Hall",
		games: {}
	},
	HOUSING: {
		name: "Housing",
		games: {}
	},
	PIT: {
		name: "Pit",
		games: {}
	},
	SKYCLASH: {
		name: "SkyClash",
		games: {}
	},
	TRUE_COMBAT: {
		name: "Crazy Walls",
		games: {}
	},
	LEGACY: {
		name: "Classic Games",
		games: {}
	},
	ARENA: {
		name: "Arena Brawl",
		games: {}
	},
	WALLS: {
		name: "Walls",
		games: {
			normal: "Normal"
		}
	},
	PAINTBALL: {
		name: "Paintball",
		games: {
			normal: "Normal"
		}
	},
	VAMPIREZ: {
		name: "VampireZ",
		games: {
			normal: "Normal"
		}
	},
	GINGERBREAD: {
		name: "Turbo Kart Racers",
		games: {
			normal: "Normal"
		}
	},
	QUAKECRAFT: {
		name: "Quakecraft",
		games: {
			solo: "Solo",
			teams: "Teams"
		}
	},
	SURVIVAL_GAMES: {
		name: "Blitz SG",
		games: {
			solo_nokits: "Solo No Kits",
			solo_normal: "Solo",
			teams_normal: "Teams"
		}
	},
	TNTGAMES: {
		name: "TNT Games",
		games: {
			TNTRUN: "TNT Run",
			PVPRUN: "PVP Run",
			BOWSPLEEF: "Bow Spleef",
			TNTAG: "TNT Tag",
			CAPTURE: "Wizards"
		}
	},
	TNT: {
		name: "TNT Games",
		games: {
			TNTRUN: "TNT Run",
			PVPRUN: "PVP Run",
			BOWSPLEEF: "Bow Spleef",
			TNTAG: "TNT Tag",
			CAPTURE: "Wizards"
		}
	},
	WALLS3: {
		name: "Mega Walls",
		games: {
			face_off: "Face Off",
			standard: "Standard",
			gvg: "Challenge"
		}
	},
	ARCADE: {
		name: "Arcade",
		games: {
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
		}
	},
	UHC: {
		name: "UHC Champions",
		games: {
			SOLO: "Solo",
			TEAMS: "Teams",
			EVENT: "Event"
		}
	},
	MCGO: {
		name: "Cops and Crims",
		games: {
			normal: "Defusal",
			deathmatch: "Team Deathmatch",
			challenge: "Challenge",
			normal_party: "Defusal (Challenge)",
			deathmatch_party: "Team Deathmatch (Challenge)"
		}
	},
	BATTLEGROUND: {
		name: "Warlords",
		games: {
			ctf_mini: "CTF",
			domination: "Domination",
			team_deathmatch: "Team Deathmatch"
		}
	},
	SUPER_SMASH: {
		name: "Smash Heroes",
		games: {
			"1v1_normal": "1v1",
			friends_normal: "Friends",
			solo_normal: "Solo",
			"2v2_normal": "2v2",
			teams_normal: "2v2v2"
		}
	},
	SMASH: {
		name: "Smash Heroes",
		games: {
			TEAM: "Team"
		}
	},
	SKYWARS: {
		name: "SkyWars",
		games: {
			solo_normal: "Solo Normal",
			solo_insane: "Solo Insane",
			teams_normal: "Doubles Normal",
			teams_insane: "Doubles Insane",
			ranked_normal: "Ranked",
			mega_normal: "Mega",
			mega_doubles: "Mega Doubles",
			lab: "Laboratory",
			solo_insane_hunters_vs_beasts: "Solo Hunters vs Beasts",
			solo_insane_lucky: "Solo Lucky Block",
			teams_insane_lucky: "Teams Lucky Block",
			solo_insane_tnt_madness: "Solo TNT Madness",
			teams_insane_tnt_madness: "Teams TNT Madness",
			solo_insane_rush: "Solo Rush",
			teams_insane_rush: "Teams Rush",
			solo_insane_slime: "Solo Slime",
			teams_insane_slime: "Teams Slime"
		}
	},
	SPEED_UHC: {
		name: "Speed UHC",
		games: {
			solo_normal: "Solo Normal",
			solo_insane: "Solo Insane",
			teams_normal: "Teams Normal",
			teams_insane: "Teams Insane"
		}
	},
	PROTOTYPE: {
		name: "Prototype",
		games: {
			PVP_CTW: "Capture The Wool",
			TOWERWARS: "TowerWars",
			TOWERWARS_SOLO: "TowerWars Solo",
			TOWERWARS_TEAM_OF_TWO: "TowerWars Team"
		}
	},
	"BED WARS": {
		name: "BedWars",
		games: {
			EIGHT_ONE: "Solo",
			EIGHT_TWO: "Doubles",
			FOUR_THREE: "3v3v3v3",
			FOUR_FOUR: "4v4v4v4",
			PRACTICE: "Practice",
			EIGHT_ONE_RUSH: "Rush Solo",
			EIGHT_TWO_RUSH: "Rush Doubles",
			FOUR_FOUR_RUSH: "Rush 4v4v4v4",
			EIGHT_ONE_ULTIMATE: "Ultimate Solo",
			EIGHT_TWO_ULTIMATE: "Ultimate Doubles",
			FOUR_FOUR_ULTIMATE: "Ultimate 4v4v4v4",
			CASTLE: "Castle",
			EIGHT_TWO_LUCKY: "Lucky Block Doubles",
			FOUR_FOUR_LUCKY: "Lucky Block 4v4v4v4",
			EIGHT_TWO_VOIDLESS: "Voidless Doubles",
			FOUR_FOUR_VOIDLESS: "Voidless 4v4v4v4",
			EIGHT_TWO_ARMED: "Armed Doubles",
            FOUR_FOUR_ARMED: "Armed 4v4v4v4",
            FOUR_FOUR_UNDERWORLD: "Underworld 4v4v4v4",
		}
	},
	MURDER_MYSTERY: {
		name: "Murder Mystery",
		games: {
			MURDER_CLASSIC: "Classic",
			MURDER_ASSASSINS: "Assassins",
			MURDER_INFECTION: "Infection",
			MURDER_SHOWDOWN: "Showdown",
			MURDER_DOUBLE_UP: "Double Up"
		}
	},
	BUILD_BATTLE: {
		name: "Build Battle",
		games: {
			GUESS_THE_BUILD: "Guess the Build",
			SOLO_NORMAL: "Solo",
			TEAMS_NORMAL: "Teams",
			SOLO_PRO: "Pro",
			HALLOWEEN: "Halloween Hyper Mode",
			CHRISTMAS_NEW_SOLO: "Christmas Solo",
			CHRISTMAS_NEW_TEAMS: "Christmas Teams",
			SOLO_NORMAL_LATEST: "Solo (1.14)"
		}
	},
	DUELS: {
		name: "Duels",
		games: {
			BOW_DUEL: "Bow Duel",
			MW_DUEL: "Mega Walls Duel",
			UHC_FOUR: "UHC 4v4",
			SW_DOUBLES: "SkyWars 2v2",
			UHC_DOUBLES: "UHC 2v2",
			UHC_DUEL: "UHC 1v1",
			OP_DOUBLES: "OP 2v2",
			OP_DUEL: "OP 1v1",
			MW_DOUBLES: "Mega Walls 2v2",
			CLASSIC_DUEL: "Classic 1v1",
			POTION_DUEL: "Potion 1v1",
			COMBO_DUEL: "Combo 1v1",
			SW_DUEL: "SkyWars 1v1",
			BLITZ_DUEL: "Blitz 1v1",
			BOWSPLEEF_DUEL: "Bowspleef 1v1",
            SUMO_DUEL: "Sumo 1v1",
            PARKOUR_EIGHT: "Parkour Duels",
            BOXING_DUEL: "Boxing 1v1",
			SW_TOURNAMENT: "SkyWars Tournament",
			UHC_TOURNAMENT: "UHC Tournament",
			SUMO_TOURNAMENT: "Sumo Tournament",
			BRIDGE_DUEL: "Bridge 1v1",
            BRIDGE_DOUBLES: "Bridge 2v2",
            BRIDGE_THREES: "Bridge 3v3",
			BRIDGE_FOUR: "Bridge 4v4",
			BRIDGE_2V2V2V2: "Bridge 2v2v2v2",
			BRIDGE_3V3V3V3: "Bridge 3v3v3v3",
			BRIDGE_TOURNAMENT: "Bridge Tournament"
		}
	},
	SKYBLOCK: {
		name: "SkyBlock",
		games: {
			dynamic: "Private Island",
			hub: "Hub",
			farming_1: "The Barn",
			farming_2: "Mushroom Desert",
			mining_1: "Gold Mine",
			mining_2: "Deep Caverns",
			mining_3: "Dwarven Mines",
			combat_1: "Spider's Den",
			combat_2: "Blazing Fortress",
			combat_3: "The End",
			foraging_1: "Floating Islands",
			dark_auction: "Dark Auction",
			dungeon: "Dungeons"
		}
	}
};

async function run() {
	const container = document.getElementById("gamesContainer");

	usernames = ["DSNS", "AmKale", "jiebi"];
	for (const IGN of usernames) {
		const recentGames = await fetch(`https://api.slothpixel.me/api/players/${IGN}/recentGames`).then((response) => response.json());

		const column = document.createElement("div");
		const label = document.createElement("h1");
		column.classList = "column";
		label.innerHTML = IGN;
		column.appendChild(label);

		for (const recentGame of recentGames) {
			console.log(recentGame);
			const recentTime = new Date(recentGame["date"]).toLocaleDateString("en-US", {
				hour: "numeric",
				minute: "numeric",
				hour12: true
			});

			var game = recentGame["gameType"];
			var mode = recentGame["mode"] || "N/A";

			if (mode == "LOBBY") {
				mode = "Lobby";
			} else {
				if (game == "Duels") {
					mode = mode.replace(/DUELS_/g, "");
				}

				if (game == "Bed Wars") {
					mode = mode.replace(/BEDWARS_/g, "");
				}

				if (gameTypes[game.toUpperCase()]) {
					if (mode in gameTypes[game.toUpperCase()]["games"]) {
						mode = gameTypes[game.toUpperCase()]["games"][mode] || mode;
					}
				}
			}

			var map = recentGame["map"] || "N/A";

			if (recentGame["mode"]) {
				column.innerHTML = column.innerHTML + "<br>" + `${mode} ${game} at ${recentTime} on ${map}.`;
			} else {
				column.innerHTML = column.innerHTML + "<br>" + `${recentGame["gameType"]} at ${recentTime}`;
			}
		}

		container.appendChild(column);
	}
}

run();