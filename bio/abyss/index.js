let kd = document.getElementById("kd");
kd.value = 4
onChangeNumber()


async function calculateWinsNeeded(kd, kills, deaths) {
	if (kd <= 2) return [Infinity, Infinity];
	while (kills / deaths < 2) {
		kills = kills + kd;
		deaths = deaths + 1;
	}

	return [kills, deaths];
}

async function run() {
	const DSNS = await fetch("https://api.slothpixel.me/api/players/DSNS").then((res) => res.json());
	const jiebi = await fetch("https://api.slothpixel.me/api/players/jiebi").then((res) => res.json());

	const resultDSNS = document.getElementById("DSNS");
	resultDSNS.innerHTML = 9000 - DSNS["stats"]["Duels"]["general"]["wins"];

	const k = jiebi["stats"]["SkyWars"]["kills"];
	const d = jiebi["stats"]["SkyWars"]["deaths"];
	const resultjiebi = document.getElementById("jiebi");
	resultjiebi.innerHTML = d * 2 - k;
}

async function onChangeNumber() {
	const jiebi = await fetch("https://api.slothpixel.me/api/players/jiebi").then((res) => res.json());

	let jiebi2 = document.getElementById("jiebi2");

	const k = jiebi["stats"]["SkyWars"]["kills"];
	const d = jiebi["stats"]["SkyWars"]["deaths"];

	const calculateResult = await calculateWinsNeeded(Number(kd.value), k, d);
	jiebi2.innerHTML = calculateResult[0].toFixed(0) - k;
}

run();
