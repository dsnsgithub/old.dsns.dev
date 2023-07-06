const circle = document.getElementById("circle");
circle.style.display = "none";

const box = document.getElementById("box");

const score = document.getElementById("score");
score.innerHTML = 0;

const time = document.getElementById("stopwatch");
time.innerHTML = 0;

document.getElementById("other").style.display = "none";

var dimensions;
var set;

var wait;
var wait2;
var trail;
var locationX;
var locationY;

function tracker(event) {
	var x = event.clientX;
	var y = event.clientY;
	locationX = x - parseInt(circle.offsetWidth / 2) + "px";
	locationY = y - parseInt(circle.offsetHeight / 2) + "px";
	circle.style.marginLeft = locationX;
	circle.style.marginTop = locationY;
}

function createApple(size) {
	trail = document.createElement("div");
	trail.classList.add("trail");

	trail.style.backgroundColor = "black";
	trail.style.width = size + "vw";
	trail.style.height = size + "vw";
	trail.style.borderRadius = size + "vw";

	trail.style.marginLeft = Math.floor(Math.random() * (box.offsetWidth - 20)) + 10 + "px";
	trail.style.marginTop = Math.floor(Math.random() * (box.offsetHeight - 20)) + 10 + "px";
	document.body.appendChild(trail);
}

function checkCollision(event) {
	if (event.target === trail || trail.contains(event.target)) {
		time.innerHTML = 0;
		trail.remove();
		createApple(dimensions);
		score.innerHTML++;
	} else {
		alert("gg! you missed.");
		clearInterval(wait);
		end();
	}
}

function stopWatch(limit) {
	time.innerHTML++;

	if (time.innerHTML == limit) {
		alert("gg! you lost.");
		clearInterval(wait);
		end();
	}

	if (score.innerHTML == 10) {
		alert("gg! you won.");
		clearInterval(wait);
		end();
	}
}

function start(time, size) {
	circle.style.display = "";
	dimensions = size;
	set = time;
	wait = setInterval(function () {
		stopWatch(set);
	}, 10);
	document.addEventListener("mousemove", tracker);
	document.getElementById("choices").style.display = "none";
	document.getElementById("other").style.display = "";
	wait2 = setTimeout(function () {
		document.addEventListener("click", checkCollision);
	}, 1);

	createApple(dimensions);
}

function end() {
	score.innerHTML = 0;
	time.innerHTML = 0;
	document.getElementById("choices").style.display = "";
	document.getElementById("other").style.display = "none";
	document.removeEventListener("mousemove", tracker);
	document.removeEventListener("click", checkCollision);
	trail.remove();
	circle.style.display = "none";
}

var date = new Date();

if (date.getHours() >= 19 || date.getHours() <= 6) {
	document.body.style.backgroundColor = "#070620";
	document.body.style.color = "white";
}
