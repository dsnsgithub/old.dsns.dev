const checkIfGyroIsEnabled = async () => {
	return new Promise((resolve) => {
		const id = setTimeout(() => {
			document.getElementById("nodeviceorientation").style.display = "block";
			resolve(false);
		}, 500);
		const resolveGyroCheck = () => {
			clearTimeout(id);
			resolve(true);
			document.getElementById("nodeviceorientation").style.display = "none";
			window.removeEventListener("deviceorientation", resolveGyroCheck);
		};
		window.addEventListener("deviceorientation", resolveGyroCheck);
	});
};

const updateDeviceOrientationData = (event) => {
	const alphaElem = document.getElementById("alpha");
	const betaElem = document.getElementById("beta");
	const gammaElem = document.getElementById("gamma");

	const indicatorElem = document.getElementById("indicator");
	const rulerImg = document.getElementById("ruler");

	if (event.beta == null || event.beta == undefined) {
		alert("Sorry, your browser/device doesn't support Device Orientation");
		return;
	}

	alphaElem.innerText = event.alpha;
	betaElem.innerText = event.beta;
	gammaElem.innerText = event.gamma;

	if (event.beta <= 1 && event.beta >= -1) {
		//? Landscape Left
		indicatorElem.style = "background-color: #00ff00";
	} else if (event.beta >= 89 && event.beta <= 91) {
		//? Portrait
		indicatorElem.style = "background-color: #00ff00";
	} else if (event.beta <= -89 && event.beta >= -91) {
		//? Portrait Upside Down
		indicatorElem.style = "background-color: #00ff00";
	} else if (event.beta <= -179 && event.beta >= -181) {
		//? Landscape Right
		indicatorElem.style = "background-color: #00ff00";
	} else {
		indicatorElem.style = "background-color: #FFFFFF";
	}

	rulerImg.style.transform = `rotate(${event.beta}deg)`;
};

window.addEventListener("deviceorientation", updateDeviceOrientationData);

document.getElementById("requestaccess").addEventListener("click", async (e) => {
	if (typeof DeviceOrientationEvent === "undefined" || !DeviceOrientationEvent.requestPermission) {
		return false;
	}

	await DeviceOrientationEvent.requestPermission(e);
	await init();
	location.reload();
});

const init = async () => {
	const isGyroEnabled = await checkIfGyroIsEnabled();
	if (!isGyroEnabled) {
		document.getElementById("nodeviceorientation").style.display = "block";
		return;
	}

	document.getElementById("deviceorientation").style.display = "block";
};

init();
