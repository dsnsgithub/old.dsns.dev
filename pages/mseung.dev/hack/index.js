const box = document.getElementById("box");
const scare = document.getElementById("scare");

var colors = ["red", "orange", "yellow", "green", "blue", "purple"];
var wait;
var wait2;

function jumpscare() {
	box.style.display = "none";
	document.documentElement.requestFullscreen();

	wait = setInterval(epilepsy, 10);
	scare.currentTime = 6.0;
	scare.play();
	wait2 = setInterval(replay, 5000);
}

function epilepsy() {
	document.body.style.backgroundColor = colors[Math.floor(Math.random() * 6) + 0];
}

function replay() {
	scare.currentTime = 6.0;
	scare.play();
}

window.addEventListener("beforeunload", function (e) {
	e.preventDefault();
	e.returnValue = "";
});
