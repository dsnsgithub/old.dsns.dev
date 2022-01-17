const source = new EventSource("/differenceData");

source.addEventListener("message", (message) => {
	// Parse SSE from server
	const serverData = JSON.parse(message.data);

	// If SSE failed
	if (serverData == "failed") {
		window.location.href = "/difference/error.html";
	}
	console.log(serverData);

	//Load Google Charts JS
	google.charts.load("current", { packages: ["corechart"] });
	google.charts.setOnLoadCallback(createCharts);

	function createCharts() {
		const amkaleData = google.visualization.arrayToDataTable(JSON.parse(serverData.AmKaleGraphArray));
		const jiebiData = google.visualization.arrayToDataTable(JSON.parse(serverData.jiebiGraphArray));

		const amkaleChart = new google.visualization.LineChart(document.getElementById("AmKale_chart"));
		const jiebiChart = new google.visualization.LineChart(document.getElementById("jiebi_chart"));

		const options = {
			curveType: "function",
			chartArea: { height: "97%" },
			legend: { position: "none" },
			hAxis: { textPosition: "none" }
		};

		// Draw the charts
		amkaleChart.draw(amkaleData, options);
		jiebiChart.draw(jiebiData, options);

		// Responsive Charts
		let timeout;
		window.addEventListener("resize", () => {
			if (timeout) window.cancelAnimationFrame(timeout);

			timeout = window.requestAnimationFrame(function () {
				amkaleChart.draw(amkaleData, options);
				jiebiChart.draw(jiebiData, options);
			});
		});
	}

	const status = JSON.parse(serverData.status);
	const recentGames = JSON.parse(serverData.recentGames);

	const statusDiv = document.getElementById("statusColumns");

	statusDiv.innerHTML = "";

	for (const i in status) {
		const column = document.createElement("div");
		column.className = "column is-full mt-4";
		const statusSpan = document.createElement("h3");
		const recentSpan = document.createElement("h3");
		statusSpan.innerText = status[i];
		recentSpan.innerText = recentGames[i];

		column.appendChild(statusSpan);
		column.appendChild(recentSpan);

		statusDiv.appendChild(column);
	}

	document.getElementById("differenceAmKale").innerText = serverData.differenceAmKale;
	document.getElementById("differenceJiebi").innerText = serverData.differenceJiebi;
	document.getElementById("jiebiAmkale").innerText = Math.abs(Number(serverData.differenceJiebi - serverData.differenceAmKale).toFixed(3));
	document.getElementById("date").innerText = "Last Updated: " + serverData.date;
});
