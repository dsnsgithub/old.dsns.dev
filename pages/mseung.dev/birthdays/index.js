const cards = document.getElementsByClassName("item");
const rows = document.getElementsByClassName("row");
const currentDate = document.getElementById("currentDate");
const birthdaypeople = document.getElementById("birthdaypeople");
const people = document.getElementById("people");

var names = [
	"Eatsand",
	"BearRitto",
	"Kdev",
	"Daniel",
	"!Pegasus",
	"Igloo",
	"Robux",
	"Bello",
	"Aj.",
	"Spaceboy",
	"Wowza",
	"Tomato",
	"Alpha",
	"DSNS",
	"Tricky",
	"Ralph",
	"Sean",
	"ActFartworm",
	"Kyler",
	"Hxzu",
	"Sanik"
];
var dates = ["0614", "0614", "0111", "1110", "0402", "0402", "0305", "0818", "0427", "0708", "0618", "0724", "0303", "0517", "0408", "1006", "0224", "1119", "0123", "0106", "0521"];
var colors = ["lightcoral", "lightsalmon", "lightyellow", "lightgreen", "lightblue", "pink"];
var oldDates = [];
var newDates = [];
var evenNewerDates = [];
var newNames = [];
var date = new Date();
var enableSection = false;
var onlyonceagainagainagain = false;
var hasbeenSorted = false;
var cardString;

function checkTime() {
	if (date.getHours() >= 19 || date.getHours() <= 6) {
		document.body.style.backgroundColor = "#070620";
		document.body.style.color = "white";
		document.getElementById("container").style.backgroundColor = "#160f3a";
		colors = ["maroon", "darkorange", "goldenrod", "darkgreen", "darkblue", "purple"];
		onlyonceagainagain();
	}
}

function onlyonceagainagain() {
	if (onlyonceagainagainagain == false) {
		onlyonceagainagainagain = true;
		for (let i = 0; i < names.length; i++) {
			cards[i].style.backgroundColor = colors[Math.floor(Math.random() * colors.length) + 0];
		}
	}
}

for (let i = 0; i < names.length; i++) {
	oldDates.push(dates[i]);
	cards[i].style.backgroundColor = colors[Math.floor(Math.random() * colors.length) + 0];
	cards[i].innerHTML = names[i] + "<br>";
	cards[i].innerHTML = cards[i].innerHTML + dates[i].charAt(0) + dates[i].charAt(1) + "/" + dates[i].charAt(2) + dates[i].charAt(3);
}

var olderVar;
var onlyonce = false;

function sort() {
	newNames = [];
	newDates = [];
	olderVar = undefined;

	dates = dates.sort((a, b) => a - b);
	for (let i = 0; i < dates.length; i++) {
		if (
			(date.getMonth() + 1 >= Number(dates[0].charAt(0) + dates[0].charAt(1)) && date.getDate() > Number(dates[0].charAt(2) + dates[0].charAt(3))) ||
			date.getMonth() + 1 > Number(dates[0].charAt(0) + dates[0].charAt(1))
		) {
			dates.push(dates.shift());
		}
	}

	for (let i = 0; i < names.length; i++) {
		newDates.push(dates[i]);
		evenNewerDates.push(dates[i]);
	}

	var temp = evenNewerDates.length;
	for (let i = 0; i < temp; i++) {
		onlyonceplz();
		onlyonce = true;
		olderVar = oldDates.indexOf(evenNewerDates[0]);
		evenNewerDates.splice(0, 1);
		if (oldDates.indexOf(evenNewerDates[0]) != olderVar) {
			newNames.push(names[oldDates.indexOf(evenNewerDates[0])]);
		} else if (oldDates.indexOf(evenNewerDates[0]) == olderVar) {
			newNames.push(names[oldDates.indexOf(evenNewerDates[0]) + 1]);
		}
	}

	function onlyonceplz() {
		if (onlyonce == false) {
			if (oldDates.indexOf(evenNewerDates[0]) != olderVar) {
				newNames.push(names[oldDates.indexOf(evenNewerDates[0])]);
			} else if (oldDates.indexOf(evenNewerDates[0]) == olderVar) {
				newNames.push(names[oldDates.indexOf(evenNewerDates[0]) + 1]);
			}
		}
	}
}
sort();

for (let i = 0; i < names.length; i++) {
	cards[i].style.backgroundColor = colors[Math.floor(Math.random() * colors.length) + 0];
	cards[i].innerHTML = newNames[i] + "<br>";
	cards[i].innerHTML = cards[i].innerHTML + newDates[i].charAt(0) + newDates[i].charAt(1) + "/" + newDates[i].charAt(2) + newDates[i].charAt(3);
}

var enableBirthdays = false;
var birthdaynumber = 0;
var cardnumber = 0;
var row;
var card;
var birthdaylist = [];

onlyonce = false;
function check() {
	for (let i = 0; i < names.length; i++) {
		if (Number(dates[i].charAt(0).toString() + dates[i].charAt(1).toString()) === Number(date.getMonth()) + 1) {
			if (Number(dates[i].charAt(2).toString() + dates[i].charAt(3).toString()) === Number(date.getDate())) {
				birthdaypeople.style.display = "flex";
				people.appendChild(cards[i]);
				birthdaylist.push(cards[i]);
				enableBirthdays = true;
				birthdaynumber++;
			} else {
				if (birthdaylist.includes(cards[i])) {
					for (let u = 0; u < birthdaylist.length; u++) {
						document.getElementById("row" + rows.length).append(birthdaylist.shift());
						birthdaylist.splice(0, 1);
						birthdaynumber--;
					}
				}
			}
		} else {
			if (birthdaylist.includes(cards[i])) {
				for (let u = 0; u < birthdaylist.length; u++) {
					document.getElementById("row" + rows.length).append(birthdaylist.shift());
					birthdaylist.splice(0, 1);
					birthdaynumber--;
				}
			}
		}
		if (birthdaynumber == 0) {
			enableBirthdays = false;
			birthdaypeople.style.display = "none";
		}
	}
	if (enableBirthdays == true) {
		for (let x = 1; x < rows.length + 1; x++) {
			cardnumber = cardnumber + birthdaynumber;
			row = document.getElementById("row" + x);
			while (row.childElementCount < 4 && cardnumber < cards.length) {
				card = cards[cardnumber];
				row.append(card);
				cardnumber++;
			}
		}

		sort();
		for (let i = 0; i < names.length; i++) {
			cards[i].style.backgroundColor = colors[Math.floor(Math.random() * colors.length) + 0];
			cards[i].innerHTML = newNames[i] + "<br>";
			cards[i].innerHTML = cards[i].innerHTML + newDates[i].charAt(0) + newDates[i].charAt(1) + "/" + newDates[i].charAt(2) + newDates[i].charAt(3);
		}
	}
}

var oldVar;
var onlyonceagain = false;

setInterval(function () {
	oldVar = date.getDate();
	date = new Date();
	currentDate.innerHTML = date;
	checkTime();
	if (onlyonceagain == false) {
		onlyonceagain = true;
		check();
	}
	if (oldVar != date.getDate()) {
		check();
	}
}, 100);
