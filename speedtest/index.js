const speedtest = new Speedtest();
const statusDiv = document.getElementById("status");

speedtest.onupdate = function (data) {
	const downloadSpeedDiv = document.getElementById("download");
	const uploadSpeedDiv = document.getElementById("upload");
	const ispInfo = document.getElementById("ispinfo");

	const pingDiv = document.getElementById("ping");
	const jitter = document.getElementById("jitter");

	ispInfo.innerText = data.clientIp;

	if (data.testState == 0) {
		statusDiv.innerText = "Connecting to Speedtest Server....";
	}

	if (data.testState == 1) {
		statusDiv.innerText = "Download Transfer in Progress....";

		if (data.dlStatus) {
			downloadSpeedDiv.innerText = data.dlStatus + " mbps";
		} else {
			downloadSpeedDiv.innerText = "⌛";
		}
	}

	if (data.testState == 2) {
		statusDiv.innerText = "Pinging Speedtest server....";

		if (data.pingStatus) {
			pingDiv.innerText = data.pingStatus + " ms";
		} else {
			pingDiv.innerText = "⌛";
		}

		if (data.jitterStatus) {
			jitter.innerText = data.jitterStatus + " ms";
		} else {
			jitter.innerText = "⌛";
		}
	}

	if (data.testState == 3) {
		statusDiv.innerText = "Upload Transfer in Progress....";

		if (data.ulStatus) {
			uploadSpeedDiv.innerText = data.ulStatus + " mbps";
		} else {
			uploadSpeedDiv.innerText = "⌛";
		}
	}
};

speedtest.onend = function (aborted) {
	if (!aborted) {
		statusDiv.innerText = "Speedtest Completed";
	}
};

speedtest.addTestPoint({
	name: "Los Angeles, United States (1) (Clouvider)",
	server: "https://la.speedtest.clouvider.net/backend/",
	id: 54,
	dlURL: "garbage.php",
	ulURL: "empty.php",
	pingURL: "empty.php",
	getIpURL: "getIP.php"
});

speedtest.setSelectedServer({
	name: "Los Angeles, United States (1) (Clouvider)",
	server: "https://la.speedtest.clouvider.net/backend/",
	id: 54,
	dlURL: "garbage.php",
	ulURL: "empty.php",
	pingURL: "empty.php",
	getIpURL: "getIP.php"
});

const startButton = document.getElementById("start");

startButton.addEventListener("click", function () {
	const downloadSpeedDiv = document.getElementById("download");
	const uploadSpeedDiv = document.getElementById("upload");
	const ispInfo = document.getElementById("ispinfo");

	const pingDiv = document.getElementById("ping");
	const jitter = document.getElementById("jitter");

	downloadSpeedDiv.innerText = "...";
	uploadSpeedDiv.innerText = "...";
	pingDiv.innerText = "...";
	jitter.innerText = "...";
	ispInfo.innerText = "...";

	speedtest.start();
});
