let historyCache = {};
let ignCache = {};
let uuidCache = {};

function toggle(uuid) {
	const UUIDs = JSON.parse(window.localStorage.getItem("UUIDs"));

	UUIDs[uuid] = !UUIDs[uuid];
	window.localStorage.setItem("UUIDs", JSON.stringify(UUIDs));

	const button = document.getElementById(uuid);
	if (UUIDs[uuid]) {
		button.classList = "button m-1 is-large is-info";
	} else {
		button.classList = "button m-1 is-large";
	}

	loadChart();
}

const differenceButton = document.getElementById("differenceButton");
let differenceEnabled = true;

differenceButton.addEventListener("click", () => {
	if (differenceEnabled) {
		differenceButton.classList = "button is-info";
		differenceButton.innerText = "Enable Difference Mode";
		differenceEnabled = false;
	} else {
		differenceButton.classList = "button is-danger";
		differenceButton.innerText = "Disable Difference Mode";
		differenceEnabled = true;
	}

	loadChart();
});

const ignSubmit = document.getElementById("ignSubmit");
ignSubmit.addEventListener("click", async () => {
	const ignInput = document.getElementById("ignInput").value;

	let result = {};
	if (ignCache[ignInput]) {
		result = ignCache[ignInput];
	} else {
		result = await fetch(`https://cors.dsns.dev/api.mojang.com/users/profiles/minecraft/${ignInput}`).then((res) => res.json());
		ignCache[ignInput] = result;
	}

	if (!result["id"]) return alert("Invalid IGN");

	const uuid = result["id"];
	const UUIDs = JSON.parse(window.localStorage.getItem("UUIDs"));

	UUIDs[uuid] = true;

	window.localStorage.setItem("UUIDs", JSON.stringify(UUIDs));
	refreshPlayerList();
});

document.onkeyup = function (event) {
	if (event.key == "Enter") {
		event.preventDefault();
		ignSubmit.click();
	}
};

const suggestedUUIDs = {
	"557bafa10aad40bbb67207a9cefa8220": true,
	"769f1d98aeef49cd934b4202e1c5537f": true
};

if (!window.localStorage.getItem("UUIDs")) window.localStorage.setItem("UUIDs", JSON.stringify(suggestedUUIDs));

async function refreshPlayerList() {
	const playerList = document.getElementById("player-list");
	playerList.innerHTML = "";
	for (const uuid in JSON.parse(window.localStorage.getItem("UUIDs"))) {
		const columnDiv = document.createElement("div");
		columnDiv.classList = "column is-one-third";

		const button = document.createElement("button");
		button.id = uuid;
		button.style.width = "100%";

		let result = {};
		if (uuidCache[uuid]) {
			result = uuidCache[uuid];
		} else {
			result = await fetch(`https://cors.dsns.dev/sessionserver.mojang.com/session/minecraft/profile/${uuid}`).then((res) => res.json());
			uuidCache[uuid] = result;
		}

		const IGN = result["name"];

		button.innerHTML = `<h2>${IGN}</h2><img src="https://crafatar.com/avatars/${uuid}" width="30px" style="margin-left: 10px">`;
		button.setAttribute("onClick", `toggle("${uuid}")`);

		if (JSON.parse(window.localStorage.getItem("UUIDs"))[uuid]) {
			button.classList = "button m-1 is-large is-info";
		} else {
			button.classList = "button m-1 is-large";
		}

		columnDiv.appendChild(button);
		playerList.appendChild(columnDiv);
	}

	loadChart();
}

async function loadChart() {
	let combinedArray = [["Date"]];
	let combined = {};
	let storedDates = {};

	let storage = JSON.parse(window.localStorage.getItem("UUIDs"));
	for (const uuid in storage) {
		if (!storage[uuid]) continue;

		let response = {};
		if (historyCache[uuid]) {
			response = historyCache[uuid];
		} else {
			response = await fetch(`/api/history/${uuid}`).then((res) => res.json());
			historyCache[uuid] = response;
		}

		let result = {};
		if (uuidCache[uuid]) {
			result = uuidCache[uuid];
		} else {
			result = await fetch(`https://cors.dsns.dev/sessionserver.mojang.com/session/minecraft/profile/${uuid}`).then((res) => res.json());
			uuidCache[uuid] = result;
		}

		const IGN = result["name"];

		combinedArray[0].push(IGN);

		if (!combined[IGN]) combined[IGN] = [];
		combined[IGN] = response;
	}

	for (const IGN in combined) {
		for (const index in combined[IGN]) {
			const entry = combined[IGN][index];

			if (!storedDates[entry["date"]]) {
				storedDates[entry["date"]] = [];
			}
		}
	}

	const sortedDates = Object.keys(storedDates)
		.sort((a, b) => {
			return new Date(a).getTime() - new Date(b).getTime();
		})
		.reduce((obj, key) => {
			obj[key] = storedDates[key];
			return obj;
		}, {});

	for (const IGN in combined) {
		let lastEntry = combined[IGN][0]["level"];
		for (const date in sortedDates) {
			for (const entry of combined[IGN]) {
				if (entry["date"] == date) {
					lastEntry = entry["level"];
					break;
				}
			}
			sortedDates[date].push(lastEntry);
		}
	}

	for (const date in sortedDates) {
		combinedArray.push([date].concat(sortedDates[date]));
	}

	let final = [];
	if (combinedArray[0].length == 3 && differenceEnabled) {
		final.push(["Date", `Difference between ${combinedArray[0][1]} and ${combinedArray[0][2]}`]);
		combinedArray.shift();

		for (let row of combinedArray) {
			row[1] = Math.abs(row[2] - row[1]);
			row.pop();

			final.push(row);
		}
	} else {
		final = combinedArray;
	}

	const data = google.visualization.arrayToDataTable(final);
	const chart = new google.visualization.LineChart(document.getElementById("chart"));

	chart.draw(data, {
		title: "Hypixel Level Statistics",
		curveType: "function",
		legend: { position: "bottom" },
		hAxis: { textPosition: "none" }
	});

	// Responsive Charts
	let timeout;
	window.addEventListener("resize", () => {
		if (timeout) window.cancelAnimationFrame(timeout);

		timeout = window.requestAnimationFrame(function () {
			chart.draw(data, {
				title: "Hypixel Level Statistics",
				curveType: "function",
				legend: { position: "bottom" },
				hAxis: { textPosition: "none" }
			});
		});
	});
}

google.charts.load("current", { packages: ["corechart"] });
google.charts.setOnLoadCallback(refreshPlayerList);

setInterval(() => {
	historyCache = {};
	loadChart();
}, 120000);
