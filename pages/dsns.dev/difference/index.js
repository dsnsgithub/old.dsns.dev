const source = new EventSource("/differenceData");

source.addEventListener("message", (message) => {
	google.charts.load("current", { packages: ["corechart"] });
	google.charts.setOnLoadCallback(drawAmKaleChart);
	google.charts.setOnLoadCallback(drawJiebiChart);

	const serverData = JSON.parse(event.data);

	console.log(serverData);
	const jiebiAmkale = document.getElementById("jiebiAmkale");
	jiebiAmkale.innerHTML = Math.abs(Number(serverData.differenceJiebi - serverData.differenceAmKale).toFixed(3));

	function drawAmKaleChart() {
		const data = google.visualization.arrayToDataTable(JSON.parse(serverData.AmKaleGraphArray));

		const options = {
			curveType: "function",
			chartArea: { height: "97%" },
			legend: { position: "none" },
			hAxis: { textPosition: "none" }
		};

		const chart = new google.visualization.LineChart(document.getElementById("AmKale_chart"));

		// Setup a timer
		var timeout;

		// Listen for resize events
		window.addEventListener("resize", () => {
			if (timeout) {
				window.cancelAnimationFrame(timeout);
			}

			timeout = window.requestAnimationFrame(function () {
				chart.draw(data, options);
			});
		});

		chart.draw(data, options);
	}

	function drawJiebiChart() {
		const data = google.visualization.arrayToDataTable(JSON.parse(serverData.jiebiGraphArray));

		const options = {
			curveType: "function",
			chartArea: { height: "97%" },
			legend: { position: "none" },
			hAxis: { textPosition: "none" }
		};

		const chart = new google.visualization.LineChart(document.getElementById("jiebi_chart"));

		// Setup a timer
		var timeout;

		// Listen for resize events
		window.addEventListener("resize", () => {
			if (timeout) {
				window.cancelAnimationFrame(timeout);
			}

			timeout = window.requestAnimationFrame(function () {
				chart.draw(data, options);
			});
		});

		chart.draw(data, options);
	}

	const status = JSON.parse(serverData.status);
	const recentGames = JSON.parse(serverData.recentGames);

    const statusDiv = document.getElementById("statusColumns")

    statusDiv.innerHTML = ""

	for (const i in status) {
		const column = document.createElement("div");
		column.classList = "column is-full mt-4	";
		const statusSpan = document.createElement("h3");
		const recentSpan = document.createElement("h3");
		statusSpan.innerText = status[i];
		recentSpan.innerText = recentGames[i];

		column.appendChild(statusSpan);
		column.appendChild(recentSpan);

		statusDiv.appendChild(column);
	}

	const differenceAmKaleElem = document.getElementById("differenceAmKale");
	const differenceJiebiElem = document.getElementById("differenceJiebi");
	const dateElem = document.getElementById("date");

	differenceAmKaleElem.innerText = serverData.differenceAmKale;
	differenceJiebiElem.innerText = serverData.differenceJiebi;

	dateElem.innerHTML = "Last Updated: " + serverData.date;

});
