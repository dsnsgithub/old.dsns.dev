function toggle(uuid) {
	const UUIDs = JSON.parse(window.localStorage.getItem("UUIDs"));

	UUIDs[uuid] = !UUIDs[uuid];

	window.localStorage.setItem("UUIDs", JSON.stringify(UUIDs));
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
	load();
});

const suggestedUUIDs = {
	"557bafa10aad40bbb67207a9cefa8220": true,
	"769f1d98aeef49cd934b4202e1c5537f": true,
	b5ed8d9fd5254274a7ea07d6e2bf2218: false,
	"9e6cdbe98a744a33b53941cb0efd8113": false
};

if (!window.localStorage.getItem("UUIDs")) window.localStorage.setItem("UUIDs", JSON.stringify(suggestedUUIDs));

async function load() {
	const playerList = document.getElementById("player-list");
	playerList.innerHTML = "";
	for (const uuid in JSON.parse(window.localStorage.getItem("UUIDs"))) {
		const button = document.createElement("button");
		button.classList = "column is-one-third button m-1 is-large";
		button.style.marginBottom = "15px";

		const result = await fetch(`/api/uuidConvert/${uuid}`).then((res) => res.json());
		const IGN = result["name"];

		button.innerHTML = `<h2>${IGN}</h2>`;
		button.setAttribute("onClick", `toggle("${uuid}")`);

		if (JSON.parse(window.localStorage.getItem("UUIDs"))[uuid]) {
			button.classList = "column is-one-third button m-1 is-large is-primary";
		} else {
			button.classList = "column is-one-third button m-1 is-large is-danger";
		}

		playerList.appendChild(button);
		playerList.innerHTML += "<br>";
	}

	let combinedArray = [["Date"]];
	let combined = {};
	let storedDates = {};

	let storage = JSON.parse(window.localStorage.getItem("UUIDs"));
	for (const uuid in storage) {
		if (!storage[uuid]) continue;

		const response = await fetch(`/api/history/${uuid}`).then((res) => res.json());
		const [IGN, result] = response;

		combinedArray[0].push(IGN);

		if (!combined[IGN]) {
			combined[IGN] = [];
		}

		combined[IGN] = result;
	}

	for (const IGN in combined) {
		for (const index in combined[IGN]) {
			const entry = combined[IGN][index];

			if (!storedDates[entry["date"]]) {
				storedDates[entry["date"]] = [];
			}
		}
	}

	for (const date in storedDates) {
		let row = [date];
		for (const IGN in combined) {
			let found = false;
			let foundIndex = 0;
			for (const index in combined[IGN]) {
				const entry = combined[IGN][index];

				if (entry["date"] == date) {
					row.push(entry["level"]);
					found = true;
					foundIndex = index;
					break;
				}
			}

			if (!found) row.push(combined[IGN][foundIndex]["level"]);
		}

		combinedArray.push(row);
	}

	let final = [];

	if (combinedArray[0].length == 3) {
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
		legend: { position: "none" },
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
				legend: { position: "none" },
				hAxis: { textPosition: "none" }
			});
		});
	});
}

google.charts.load("current", { packages: ["corechart"] });
google.charts.setOnLoadCallback(load);

setInterval(load, 30000);
