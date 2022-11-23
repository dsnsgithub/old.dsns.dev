const birthdays = [
	{ name: "DSNS", date: "May 17" },
	{ name: "jiebi", date: "February 10" },
	{ name: "Retsed", date: "October 30" },
	{ name: "idot777", date: "May 3" },
	{ name: "Armster15", date: "January 15" },
	{ name: "LonelySouls", date: "January 29" },
	{ name: "jakeybakers", date: "April 18" },
	{ name: "Node13", date: "September 24" },
	{ name: "meh~", date: "January 7" },
	{ name: "AmKale", date: "March 21" },
	{ name: "mikachu", date: "April 17" },
	{ name: "nsno", date: "November 1" },
	{ name: "Max_AS", date: "July 8" },
	{ name: "B0B643", date: "July 11" },
	{ name: "Potato.png", date: "July 25" },
	{ name: "euphoriials", date: "August 5" },
	{ name: "doctor doom", date: "November 10" },
	{ name: "goug", date: "March 7" },
	{ name: "Fud", date: "February 11" },
	{ name: "ploplo", date: "May 4" },
	{ name: "Archer2305", date: "February 23" },
	{ name: "zell", date: "January 2" },
	{ name: "SyntaxError", date: "August 23" },
	{ name: "Lion Mountain", date: "December 30" },
	{ name: "useryz351", date: "September 22" },
	{ name: "UnEntity8", date: "March 8" },
	{ name: "Mub", date: "November 16" },
	{ name: "TempoSolos", date: "May 2" },
	{ name: "agedfish", date: "May 1" }
];

const round = (number, decimalPlaces) => {
	const factorOfTen = Math.pow(10, decimalPlaces);
	return Math.floor(number * factorOfTen) / factorOfTen;
};

const currentYear = new Date().getFullYear();
const oneDay = 1000 * 60 * 60 * 24;
const oneYear = oneDay * 365;
let turnConfettiOn = false;

for (const birthday of birthdays) {
	birthday["date"] = new Date(`${birthday["date"]} ${currentYear}`);
	const birthdayDistance = new Date() - birthday["date"];

	// If the distance is greater than one day (the birthday), roll it over to the next year
	// This ensures that the time doesn't get rolled over to the next year until after the birthday
	if (birthdayDistance > oneDay) {
		birthday["date"].setFullYear(currentYear + 1);
	}
}

// sorts the array of birthdays by date
birthdays.sort(function (a, b) {
	return a["date"] - b["date"];
});

function increaseCountdown(birthday, countdown, countdownPercent, countdownBar, countdownText) {
	const countDownDate = birthday["date"].getTime();
	const now = new Date().getTime();

	const distance = countDownDate - now;
	if (distance < 0) {
		countdown.innerText = `Happy Birthday ${birthday["name"]}!`;
		countdownPercent.innerText = "100%";
		countdownBar.value = oneYear;

		turnConfettiOn = true;
	} else {
		const days = Math.floor(distance / (1000 * 60 * 60 * 24));
		const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
		const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
		const seconds = Math.floor((distance % (1000 * 60)) / 1000);

		countdown.innerText = days + "d " + hours + "h " + minutes + "m " + seconds + "s ";
		countdownBar.setAttribute("value", oneYear - distance);
		countdownPercent.innerText = round(((oneYear - distance) / oneYear) * 100, 2) + "%";
		countdownText.innerText = `${birthday["name"]}'s Birthday`;
	}
}

for (const birthday of birthdays) {
	const birthdayContainer = document.getElementById("birthdayContainer");

	const columnDiv = document.createElement("div");
	columnDiv.className = "column is-one-third-desktop is-one-third-tablet is-half-mobile mt-6";
	birthdayContainer.appendChild(columnDiv);

	const countdownText = document.createElement("p");
	columnDiv.appendChild(countdownText);

	const countdown = document.createElement("h1");
	columnDiv.appendChild(countdown);

	const countdownBar = document.createElement("progress");
	countdownBar.className = "progress is-normal is-info";
	countdownBar.setAttribute("max", oneYear);
	columnDiv.appendChild(countdownBar);

	const countdownPercent = document.createElement("p");
	columnDiv.appendChild(countdownPercent);

	increaseCountdown(birthday, countdown, countdownPercent, countdownBar, countdownText);
	setInterval(() => {
		increaseCountdown(birthday, countdown, countdownPercent, countdownBar, countdownText);
	}, 1000);
}

if (turnConfettiOn) {
	const body = document.body;
	const html = document.documentElement;

	const confetti = new ConfettiGenerator({
		target: "canvas",
		max: document.body.clientWidth / 10,
		rotate: true,
		height: Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight)
	});
	
	confetti.render();
}
