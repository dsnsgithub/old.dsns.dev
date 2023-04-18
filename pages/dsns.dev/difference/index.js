function toggle(uuid) {
	const UUIDs = JSON.parse(window.localStorage.getItem("UUIDs"));

	if (UUIDs[uuid] == true) {
		UUIDs[uuid] = false;
	} else {
		UUIDs[uuid] = true;
	}

	window.localStorage.setItem("UUIDs", JSON.stringify(UUIDs));
	console.log(JSON.parse(window.localStorage.getItem("UUIDs")));
	load();
}
const ignSubmit = document.getElementById("ignSubmit");
ignSubmit.addEventListener("click", async () => {
	const ignInput = document.getElementById("ignInput").value;

	const result = await fetch(`/api/ignConvert/${ignInput}`).then((res) => res.json());

	if (!result["id"]) return alert("Invalid IGN");

	const uuid = result["id"];

	const UUIDs = JSON.parse(window.localStorage.getItem("UUIDs"));

	UUIDs[uuid] = true;

	window.localStorage.setItem("UUIDs", JSON.stringify(UUIDs));
	console.log(JSON.parse(window.localStorage.getItem("UUIDs")));
	load();
});

const suggestedUUIDs = {
	"557bafa10aad40bbb67207a9cefa8220": true,
	b5ed8d9fd5254274a7ea07d6e2bf2218: true,
	"9e6cdbe98a744a33b53941cb0efd8113": true,
	"769f1d98aeef49cd934b4202e1c5537f": true
};

if (!window.localStorage.getItem("UUIDs")) window.localStorage.setItem("UUIDs", JSON.stringify(suggestedUUIDs));

async function load() {
	const playerList = document.getElementById("player-list");
	playerList.innerHTML = "";
	for (const uuid in JSON.parse(window.localStorage.getItem("UUIDs"))) {
		const button = document.createElement("button");
		button.classList = "button is-large";
		button.style.marginBottom = "15px";

		const result = await fetch(`/api/uuidConvert/${uuid}`).then((res) => res.json());
		const IGN = result["name"];

		button.innerHTML = `<h2>${IGN}</h2>`;
		button.setAttribute("onClick", `toggle("${uuid}")`);

		if (JSON.parse(window.localStorage.getItem("UUIDs"))[uuid]) {
			button.classList = "button is-large is-primary";
		} else {
			button.classList = "button is-large is-danger";
		}

		playerList.appendChild(button);
		playerList.innerHTML += "<br>";
	}

	let combinedArray = [["Date"]];
	let combined = {};

	let count = 1;
	let storage = JSON.parse(window.localStorage.getItem("UUIDs"));
	for (const uuid in storage) {
		if (!storage[uuid]) continue;

		const response = await fetch(`/api/history/${uuid}`).then((res) => res.json());
		if (response.length <= 1) continue;
		const [IGN, result] = response;

		combinedArray[0].push(IGN);

		for (const key in result) {
			const entry = result[key];

			if (!combined[entry["date"]]) {
				combined[entry["date"]] = [];
			}

			if (combined[entry["date"]].length < count) {
				combined[entry["date"]].push(entry["level"]);
			}
		}
		count++;
	}

	for (const date in combined) {
		if (combined[date].length == count - 1) {
			combinedArray.push([date, ...combined[date]]);
		}
	}

	console.log(combinedArray);
	const data = google.visualization.arrayToDataTable(combinedArray);
	const chart = new google.visualization.LineChart(document.getElementById("chart"));

	chart.draw(data, {
		title: "Hypixel Level Comparison",
		curveType: "function",
		legend: { position: "none" },
		hAxis: { textPosition: "none" }
	});

	// Responsive Charts
	let timeout;
	window.addEventListener("resize", () => {
		if (timeout) window.cancelAnimationFrame(timeout);

		timeout = window.requestAnimationFrame(function () {
			chart.draw(data, {
				title: "Hypixel Level Comparison",
				curveType: "function",
				legend: { position: "none" },
				hAxis: { textPosition: "none" }
			});
		});
	});
}

google.charts.load("current", { packages: ["corechart"] });
google.charts.setOnLoadCallback(load);
