const box = document.getElementById("box");
const field = document.getElementById("setnumber");
const tempofield = document.getElementById("tempofield");

let speed = 200;
/*--------*/

/*intervals and timeouts */
var wait;
/*-------*/

/*other variables */
var blocklist = [];
var x = -1;
/*-------*/

// why are you looking in this script?
// why are you looking in this script?
// why are you looking in this script?

/* add stuff */
function createNote() {
	var newNote = document.createElement("div");
	newNote.classList.add("block");
	newNote.classList.add("note");
	addtoBox(newNote);
}

function createTrumpet() {
	var newTrumpet = document.createElement("div");
	newTrumpet.classList.add("block");
	newTrumpet.classList.add("trumpet");
	addtoBox(newTrumpet);
}

function createViolin() {
	var newViolin = document.createElement("div");
	newViolin.classList.add("block");
	newViolin.classList.add("violin");
	addtoBox(newViolin);
}

function createDrum() {
	var newDrum = document.createElement("div");
	newDrum.classList.add("block");
	newDrum.classList.add("drum");
	addtoBox(newDrum);
}

function createConnect() {
	var newConnect = document.createElement("div");
	newConnect.classList.add("block");
	newConnect.classList.add("connect");
	addtoBox(newConnect);
}

function createTempo() {
	var newTempo = document.createElement("div");
	newTempo.classList.add("block");
	newTempo.classList.add("tempo");
	addtoBox(newTempo);
}

function createPause() {
	var newPause = document.createElement("div");
	newPause.classList.add("block");
	newPause.classList.add("pause");
	addtoBox(newPause);
}

function addtoBox(item) {
	switch (item.className) {
		case "block connect":
			item.innerHTML = "=";
			break;
		case "block pause":
			for (let i = 0; i < Number(field.value) - 1; i++) {
				var newPause = document.createElement("div");
				newPause.classList.add("block");
				newPause.classList.add("pause");
				blocklist.push(newPause);
			}
		default:
			item.innerHTML = Number(field.value);
			break;
	}

	blocklist.push(item);

	box.appendChild(item);
}
/*------------*/

/* others */
function remove() {
	if (blocklist.length > 0) {
		blocklist[blocklist.length - 1].remove();
		blocklist.pop();
	}
}

function play() {
	wait = setInterval(read, speed);

	document.getElementById("play").innerHTML = "Stop";
	document.getElementById("play").onclick = stopInterval;
}

function read() {
	x++;
	if (blocklist[x] !== undefined) {
		x++;
		for (let i = 0; i < blocklist.length; i++) {
			blocklist[i].style.border = "none";
		}

		checkinFront(blocklist[x]);
	} else {
		stopInterval();
	}
}

function check() {
	blocklist[x].style.border = "2px solid gold";
	switch (blocklist[x].className) {
		case "block note":
			playAudio("middlec.mp3", 0.75);
			break;
		case "block trumpet":
			playAudio("trumpetc.mp3", 0);
			break;
		case "block violin":
			playViolinAudio();
			break;
		case "block drum":
			playAudio("bassdrum.mp3", 1.3);
			break;
		case "block connect":
			break;
		case "block pause":
			break;
		case "block tempo":
			speed = parseInt(blocklist[x].innerHTML);
			read();
			clearInterval(wait);
			wait = setInterval(read, speed);
			break;
	}
}

function checkinFront() {
	if (blocklist[x] !== undefined) {
		switch (blocklist[x].className) {
			case "block connect":
				x--;
				check();
				x += 2;
				check();
				x++;
				checkinFront();
				break;
			default:
				x--;
				check();
				break;
		}
	} else {
		x--;
		check();
	}
}

function playAudio(source, time) {
	var newSound = new Audio();
	var soundsrc = document.createElement("source");
	soundsrc.type = "audio/mpeg";
	soundsrc.src = source;
	newSound.appendChild(soundsrc);
	newSound.currentTime = time;
	if (Number(blocklist[x].innerHTML) + 1 > 15) {
		alert("Maximum pitch is 14.");
	} else {
		newSound.playbackRate = Number(blocklist[x].innerHTML) + 1;
	}

	if (soundsrc.getAttribute("src") === "trumpetc.mp3") {
		newSound.volume = 0.05;
	} else if (soundsrc.getAttribute("src") === "bassdrum.mp3") {
		newSound.volume = 0.5;
	}

	newSound.preservesPitch = false;
	newSound.play();
}

var violinAudio = document.getElementById("violin");

function playViolinAudio() {
	if (Number(blocklist[x].innerHTML) + 1 > 15) {
		alert("Maximum pitch is 14.");
	} else {
		violinAudio.playbackRate = Number(blocklist[x].innerHTML) + 1;
	}

	violinAudio.preservesPitch = false;
	violinAudio.currentTime = 0.15;
	violinAudio.play();
}

function stopInterval() {
	clearInterval(wait);
	x = -1;
	speed = 200;

	for (let i = 0; i < blocklist.length; i++) {
		blocklist[i].style.border = "none";
	}

	document.getElementById("play").innerHTML = "Play";
	document.getElementById("play").onclick = play;
}

function clearAll() {
	for (let i = 0; i < blocklist.length; i++) {
		blocklist[i].remove();
	}
	blocklist = [];
}

var date = new Date();

if (date.getHours() >= 19 || date.getHours() <= 6) {
	document.body.style.backgroundColor = "#070620";
	document.body.style.color = "white";
}
/*------------*/
