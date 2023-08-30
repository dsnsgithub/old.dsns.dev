//? Utility Functions --------------------------------------------------------------

function createCustomDate(inputTime) {
	const currentDate = new Date();

	const [inputHourRaw, inputMinuteRaw] = inputTime.split(":");
	const inputMinute = inputMinuteRaw.replace(/[A-Za-z]/g, ""); // Remove any non-numeric characters
	const isPM = inputTime.includes("PM");

	let hour = parseInt(inputHourRaw);
	if (isPM && hour !== 12) {
		hour += 12;
	} else if (hour == 12 && !isPM) {
		hour -= 12;
	}

	currentDate.setHours(hour, parseInt(inputMinute), 0, 0);
	return currentDate.getTime();
}

function formatDate(timestamp) {
	const date = new Date(timestamp); // Convert Unix timestamp to milliseconds
	const options = { hour: "numeric", minute: "2-digit", hour12: true };
	const timeString = date.toLocaleTimeString("en-US", options);
	return timeString;
}

function timeBetweenDates(firstDate, secondDate) {
	const timeDifference = secondDate - firstDate;

	let hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
	let minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
	let seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

	if (seconds < 10) seconds = `0${seconds}`;
	if (minutes < 10) minutes = `0${minutes}`;
	if (!hours) {
		return `${minutes}:${seconds}`;
	}

	return `${hours}:${minutes}:${seconds}`;
}

function sameDay(d1, d2) {
	return d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth() && d1.getDate() === d2.getDate();
}

function getOrdinalNumber(number) {
	if (!Number(number)) {
		// this is not a number lol
		return number;
	}

	if (number % 100 >= 11 && number % 100 <= 13) {
		return number + "th";
	}

	switch (number % 10) {
		case 1:
			return number + "st";
		case 2:
			return number + "nd";
		case 3:
			return number + "rd";
		default:
			return number + "th";
	}
}

function cleanXSS(input) {
	return input.replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

//? Schedule Functions -------------------------------------------------------------
async function grabSchedules(url) {
	const scheduleDB = await fetch(url).then(res => res.json());

	for (const scheduleName in scheduleDB) {
		if (scheduleName == "about") continue;

		const schedule = await fetch(`${scheduleDB["about"]["url"]}${scheduleName}.txt`)
			.then((res) => res.text())
			.then((data) => data.split("\n"));

		scheduleDB[scheduleName]["times"] = [];
		for (const line of schedule) {
			let [rawPeriodName, startTime, endTime] = line.split(" ");
			if (checkRemovedPeriods(rawPeriodName)) continue;

			let periodName = findCorrectPeriodName(rawPeriodName);
			if (periodName.length == 1) periodName = `${getOrdinalNumber(periodName)} period`;
			if (periodName == "Passing") continue;

			scheduleDB[scheduleName]["times"].push({
				rawPeriodName: rawPeriodName,
				periodName: periodName,
				startTime: createCustomDate(startTime),
				endTime: createCustomDate(endTime)
			});
		}

		const times = scheduleDB[scheduleName]["times"];
		const firstPeriod = times[0]["periodName"];
		const lastPeriod = times[times.length - 1]["periodName"];
		if (firstPeriod == "Break") {
			times.shift();
		}

		if (lastPeriod == "Break") {
			times.pop();
		}
	}

	scheduleDB["about"]["avaliablePeriods"] = scheduleDB["about"]["avaliablePeriods"].filter((element) => !checkRemovedPeriods(element));

	return scheduleDB;
}

async function findCorrectSchedule(scheduleDB, currentDate) {
	const currentTime = currentDate.getTime();
	const dayofTheWeek = currentDate.getDay();
	let mostSpecificSchedule = null;
	let mostSpecificDate = null;

	// Check for summer
	if (new Date(scheduleDB["about"]["endDate"]).getTime() < currentTime && new Date(scheduleDB["about"]["startDate"]).getTime() > currentTime) {
		return null;
	}

	// Check for off days
	for (const item of scheduleDB["about"]["noSchool"]) {
		if (typeof item === "object") {
			let [startDate, endDate] = item;
			startDate = new Date(startDate);
			endDate = new Date(endDate);

			// add one because the entire day of the endDate considered "off" still
			endDate = new Date(endDate.setDate(endDate.getDate() + 1))

			if (new Date(startDate).getTime() < currentTime && new Date(endDate).getTime() > currentTime) {
				return null;
			}
		} else {
			const startDate = new Date(item);
			let endDate = new Date(item);
			endDate = new Date(endDate.setDate(endDate.getDate() + 1));

			if (new Date(startDate).getTime() < currentTime && new Date(endDate).getTime() > currentTime) {
				return null;
			}
		}
	}


	for (const schedule in scheduleDB) {
		if (schedule == "about") continue;
		const days = scheduleDB[schedule]["days"];

		for (const day of days) {
			if (typeof day == "number") {
				if (day == dayofTheWeek) {
					if (typeof mostSpecificDate != "string") {
						mostSpecificSchedule = schedule;
						mostSpecificDate = dayofTheWeek;
					}
				}
			} else {
				if (sameDay(currentDate, new Date(`${day}/${currentDate.getFullYear()}`))) {
					mostSpecificSchedule = schedule;
					mostSpecificDate = dayofTheWeek;
				}
			}
		}
	}

	return mostSpecificSchedule;
}

async function countdown(scheduleTimes) {
	const currentTime = new Date().getTime();

	// School has started
	if (scheduleTimes[0]["startTime"] > currentTime) {
		const timeTil = timeBetweenDates(currentTime, scheduleTimes[0]["startTime"]);

		periodElem.innerHTML = `${cleanXSS(scheduleTimes[0]["periodName"])} will start in ${timeTil}`;
		timeElem.innerHTML = "Make sure to complete your homework!";
		return;
	}

	// School is over
	if (scheduleTimes[scheduleTimes.length - 1]["endTime"] < currentTime) {
		periodElem.innerHTML = "The school day is over.";
		timeElem.innerHTML = "Make sure to complete your homework!";
		return;
	}

	for (let periodIndex in scheduleTimes) {
		periodIndex = Number(periodIndex);
		const period = scheduleTimes[periodIndex];
		const nextPeriod = scheduleTimes[periodIndex + 1];

		if (period["startTime"] <= currentTime && period["endTime"] >= currentTime) {
			if (nextPeriod) {
				periodElem.innerHTML = `${cleanXSS(period["periodName"])} is in session. <br>${cleanXSS(nextPeriod["periodName"])} will start in ${timeBetweenDates(
					currentTime,
					nextPeriod["startTime"]
				)}.`;
			} else {
				periodElem.innerHTML = `${cleanXSS(period["periodName"])} is in session. <br>School will end in ${timeBetweenDates(currentTime, period["endTime"])}.`;
			}

			timeElem.innerHTML = `${formatDate(period["startTime"])} to ${formatDate(period["endTime"])}`;
			return;
		}

		// if there is a break in the schedule
		if (nextPeriod && period["endTime"] < currentTime && nextPeriod["startTime"] > currentTime) {
			periodElem.innerHTML = `${cleanXSS(nextPeriod["periodName"])} will start in ${timeBetweenDates(currentTime, nextPeriod["startTime"])}.`;
			timeElem.innerHTML = `${formatDate(nextPeriod["startTime"])} to ${formatDate(nextPeriod["endTime"])}`;

			return;
		}
	}
}

function findCorrectPeriodName(periodName) {
	if (!window.localStorage.getItem("periodNames")) return periodName;
	const periodNames = JSON.parse(window.localStorage.getItem("periodNames"));

	return periodNames[periodName] || periodName;
}

function createAvaliablePeriodsDB(scheduleDB) {
	const avaliablePeriods = scheduleDB["about"]["avaliablePeriods"];
	let entry = {};

	for (const period of avaliablePeriods) {
		entry[period] = null;
	}

	window.localStorage.setItem("periodNames", JSON.stringify(entry));
}

function createRemovedPeriodsDB() {
	window.localStorage.setItem("removedPeriods", JSON.stringify([]));
}

function checkRemovedPeriods(period) {
	if (!window.localStorage.getItem("removedPeriods")) return false;

	const removedPeriodNames = JSON.parse(window.localStorage.getItem("removedPeriods"));
	return removedPeriodNames.includes(period);
}

function populateModal(scheduleDB) {
	customizeFormElem.innerHTML = "";
	const periodNames = JSON.parse(window.localStorage.getItem("periodNames"));

	for (const period of scheduleDB["about"]["avaliablePeriods"]) {
		let cleanPeriod = "";
		if (period.length == 1) {
			cleanPeriod = `${getOrdinalNumber(period)} period`;
		}

		const field = document.createElement("div");
		field.className = "field";

		const label = document.createElement("label");
		label.textContent = cleanPeriod;
		label.className = "label";
		label.style.display = "inline-block";

		const button = document.createElement("button");
		button.className = "button is-ghost";
		button.innerHTML = "❌";
		button.style.marginTop = "-8px";

		button.addEventListener("click", async () => {
			const removedPeriodNames = JSON.parse(window.localStorage.getItem("removedPeriods"));
			removedPeriodNames.push(period);

			window.localStorage.setItem("removedPeriods", JSON.stringify(removedPeriodNames));
		});

		const input = document.createElement("input");
		input.placeholder = cleanPeriod;
		input.className = "input";
		input.type = "text";
		input.id = period;
		input.value = periodNames[period] || "";

		input.addEventListener("change", async () => {
			const periodNames = JSON.parse(window.localStorage.getItem("periodNames"));
			periodNames[period] = input.value;

			window.localStorage.setItem("periodNames", JSON.stringify(periodNames));

			clearInterval(timer);
			run(false);
		});

		field.appendChild(label);
		field.appendChild(button);
		field.appendChild(input);
		customizeFormElem.appendChild(field);
	}
}

const scheduleSection = document.getElementById("scheduleBox");
const currentSchedule = document.getElementById("currentSchedule");
const scheduleName = document.getElementById("scheduleName");
const scheduleTitle = document.getElementById("scheduleTitle");

function populateScheduleSection(schedule, name) {
	currentSchedule.innerHTML = "";
	scheduleName.innerText = schedule["officialName"];
	scheduleTitle.innerText = name;

	const times = schedule["times"];
	const table = document.createElement("table");
	table.classList = "table is-striped is-bordered is-hoverable is-fullwidth";
	table.createTBody();

	for (const period of times) {
		const row = table.insertRow();
		row.insertCell().innerText = period["periodName"];
		row.insertCell().innerText = formatDate(period["startTime"]);
		row.insertCell().innerText = formatDate(period["endTime"]);
	}

	table.createTHead();

	const headRow = table.tHead.insertRow();
	headRow.insertCell().innerHTML = "<b>Period</b>";
	headRow.insertCell().innerHTML = "<b>Start Time</b>";
	headRow.insertCell().innerHTML = "<b>End Time</b>";

	currentSchedule.appendChild(table);
	scheduleSection.style.display = "block";
}

async function populateTomorrowSection(scheduleDB, currentDate) {
	const tomorrowScheduleName = await findCorrectSchedule(scheduleDB, new Date(currentDate.setDate(currentDate.getDate() + 1)));
	if (tomorrowScheduleName != null) populateScheduleSection(scheduleDB[tomorrowScheduleName], `Tomorrow's Schedule`);
}

let timer;
const periodElem = document.getElementById("period");
const timeElem = document.getElementById("timeRange");
const customizeFormElem = document.getElementById("customizeForm");
const reset = document.getElementById("reset");

async function run(completeRefresh) {
	const currentDate = new Date();
	// const currentDate = new Date(new Date().setDate(new Date().getDate() + 3))
	const currentTime = currentDate.getTime();

	const scheduleDB = await grabSchedules("/schedule/dvhs/schedule.json");
	if (!window.localStorage.getItem("periodNames")) createAvaliablePeriodsDB(scheduleDB);
	if (!window.localStorage.getItem("removedPeriods")) createRemovedPeriodsDB();

	if (completeRefresh) {
		populateModal(scheduleDB);
	}

	const correctScheduleName = await findCorrectSchedule(scheduleDB, currentDate);
	if (correctScheduleName == null) {
		periodElem.innerHTML = "No School!";
		timeElem.innerHTML = "Enjoy your time off!";

		await populateTomorrowSection(scheduleDB, currentDate);
		return;
	}

	const scheduleTimes = scheduleDB[correctScheduleName]["times"];
	countdown(scheduleTimes);
	timer = setInterval(() => {
		countdown(scheduleTimes);
	}, 1000);

	// School is over
	if (scheduleDB[correctScheduleName]["times"][scheduleTimes.length - 1]["endTime"] < currentTime) {
		await populateTomorrowSection(scheduleDB, currentDate);
	} else {
		populateScheduleSection(scheduleDB[correctScheduleName], `Today's Schedule`);
	}
}

reset.addEventListener("click", async () => {
	clearInterval(timer);
	localStorage.clear();
	run(true);
});

run(true);
