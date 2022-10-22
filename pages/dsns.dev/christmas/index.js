let turnFireworksOn = false;
const christmasDate = new Date("December 25, 2021");
let christmasDifference = christmasDate.getTime() - new Date().getTime();

while (christmasDifference < -86400000) {
	christmasDate.setFullYear(christmasDate.getFullYear() + 1);
	christmasDifference = christmasDate.getTime() - new Date().getTime();
}

function countdown() {
	const now = new Date().getTime();
	const distance = christmasDate.getTime() - now;
	const seconds = Math.floor(distance / 1000);

	const dateCount = document.getElementById("dateCount");
	dateCount.innerHTML = seconds.toLocaleString("en-US");

	if (distance < 0) {
		dateCount.innerText = `Merry Christmas ${new Date().getFullYear()}!`;
		document.getElementById("support").innerHTML = "";

		turnFireworksOn = true;
	}
}

countdown();
setInterval(countdown, 1000);

if (turnFireworksOn) {
	const container = document.querySelector(".fireworks-container");

	// @ts-ignore
	const fireworks = new Fireworks(container, {});

	fireworks.start();

	// after initialization you can change the fireworks parameters
	fireworks.setOptions({
		hue: {
			min: 0,
			max: 345
		},
		delay: {
			min: 1,
			max: 1
		},
		rocketsPoint: 50,
		opacity: 0.5,
		speed: 10,
		acceleration: 1.2,
		friction: 0.97,
		gravity: 1.5,
		particles: 90,
		trace: 3,
		explosion: 6,
		autoresize: true,
		brightness: {
			min: 50,
			max: 80,
			decay: {
				min: 0.015,
				max: 0.03
			}
		},
		boundaries: {
			x: 50,
			y: 50,
			width: 2560,
			height: 1297,
			visible: false
		},
		sound: {
			enabled: true,
			files: ["https://fireworks.js.org/sounds/explosion0.mp3", "https://fireworks.js.org/sounds/explosion1.mp3", "https://fireworks.js.org/sounds/explosion2.mp3"],
			volume: {
				min: 22,
				max: 71
			}
		},
		mouse: {
			click: true,
			move: false,
			max: 1
		}
	});
}
