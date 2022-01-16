const speedtest = new Speedtest();
const statusDiv = document.getElementById("status");


speedtest.onupdate = function (data) {
	const downloadSpeedDiv = document.getElementById("download");
	const uploadSpeedDiv = document.getElementById("upload");
	const ispInfo = document.getElementById("ispinfo");

	const pingDiv = document.getElementById("ping");
	const jitter = document.getElementById("jitter");

	ispInfo.innerHTML = data.clientIp;

	if (data.testState == 0) {
		statusDiv.innerHTML = "Connecting to Speedtest Server....";
	}

	if (data.testState == 1) {
		statusDiv.innerHTML = "Download Transfer in Progress....";

		if (data.dlStatus) {
			downloadSpeedDiv.innerHTML = data.dlStatus + " mbps";
		} else {
			downloadSpeedDiv.innerHTML = "⌛";
		}
	}

	if (data.testState == 2) {
		statusDiv.innerHTML = "Pinging Speedtest server....";

		if (data.pingStatus) {
			pingDiv.innerHTML = data.pingStatus + " ms";
		} else {
			pingDiv.innerHTML = "⌛";
		}

		if (data.jitterStatus) {
			jitter.innerHTML = data.jitterStatus + " ms";
		} else {
			jitter.innerHTML = "⌛";
		}
	}

	if (data.testState == 3) {
		statusDiv.innerHTML = "Upload Transfer in Progress....";

		if (data.ulStatus) {
			uploadSpeedDiv.innerHTML = data.ulStatus + " mbps";
		} else {
			uploadSpeedDiv.innerHTML = "⌛";
		}
	}
};

speedtest.onend = function (aborted) {
	if (!aborted) {
		statusDiv.innerHTML = "Speedtest Completed";
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
	
	downloadSpeedDiv.innerHTML = "..."
	uploadSpeedDiv.innerHTML = "..."
	pingDiv.innerHTML = "..."
	jitter.innerHTML = "..."
	ispInfo.innerHTML = "..."

	speedtest.start();
});
