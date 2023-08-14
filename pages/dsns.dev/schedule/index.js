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
	if (!hours) {
		if (minutes < 10) minutes = `0${minutes}`;
		return `${minutes}:${seconds}`
	};

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

function getDayIndices(daysArray) {
	const dayIndexMap = {
		sunday: 0,
		monday: 1,
		tuesday: 2,
		wednesday: 3,
		thursday: 4,
		friday: 5,
		saturday: 6
	};

	return daysArray.map((day) => {
		const lowerCaseDay = day.toLowerCase();
		if (dayIndexMap.hasOwnProperty(lowerCaseDay)) {
			return dayIndexMap[lowerCaseDay];
		} else {
			throw new Error(`Invalid day: ${day}`);
		}
	});
}

function cleanXSS(input) {
	return input.replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

//? Schedule Functions -------------------------------------------------------------
async function grabSchedules() {
	const scheduleDB = {
		about: {
			startDate: "6/5/2023",
			endDate: "8/10/2023",
			avaliablePeriods: ["1", "2", "3", "4", "5", "6", "B"]
		},
		regular: {
			days: getDayIndices(["monday", "tuesday", "friday"])
		},
		wednesday: {
			days: getDayIndices(["wednesday"])
		},
		thursday: {
			days: getDayIndices(["thursday"])
		},
		minimum: {
			days: ["8/10", "6/5"]
		},
		rally: {
			days: ["8/18", "10/13", "2/16", "5/28"]
		},
		assembly: {
			days: ["10/3"]
		},
		"finalShort1+4": {
			days: ["12/18", "6/3"]
		},
		"finalShort2+5": {
			days: ["12/19", "6/4"]
		},
		"finalShort3+6": {
			days: ["12/20", "6/5"]
		},
		finalReverse: {
			days: ["12/15", "5/31"]
		}
	};

	for (const scheduleName in scheduleDB) {
		if (scheduleName == "about") continue;

		const schedule = await fetch(`dvhs/${scheduleName}.txt`)
			.then((res) => res.text())
			.then((data) => data.split("\n"));

		scheduleDB[scheduleName]["times"] = [];
		for (const line of schedule) {
			let [periodName, startTime, endTime] = line.split(" ");
			if (checkRemovedPeriods(periodName)) continue;

			periodName = findCorrectPeriodName(periodName);
			if (periodName.length == 1) {
				periodName = `${getOrdinalNumber(periodName)} period`;
			}
			if (periodName == "Passing") {
				periodName += " period";
			}

			scheduleDB[scheduleName]["times"].push({
				periodName: periodName,
				startTime: createCustomDate(startTime),
				endTime: createCustomDate(endTime)
			});
		}
	}

	scheduleDB["about"]["avaliablePeriods"] = scheduleDB["about"]["avaliablePeriods"].filter((element) => !checkRemovedPeriods(element));
	return scheduleDB;
}

async function findCorrectSchedule(scheduleDB) {
	const currentTime = new Date();
	const dayofTheWeek = currentTime.getDay();
	let mostSpecificSchedule = null;
	let mostSpecificDate = null;

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
				if (sameDay(currentTime, new Date(`${day}/${currentTime.getFullYear()}`))) {
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
		periodIndex = Number(periodIndex)
		const period = scheduleTimes[periodIndex];
		const nextPeriod = scheduleTimes[periodIndex + 1];

		if (period["startTime"] <= currentTime && period["endTime"] >= currentTime) {
			if (nextPeriod) {
				periodElem.innerHTML = `${cleanXSS(period["periodName"])} is in session. <br>${cleanXSS(nextPeriod["periodName"])} will start in ${timeBetweenDates(currentTime, period["endTime"])}.`;
			} else {
				periodElem.innerHTML = `${cleanXSS(period["periodName"])} is in session. <br>School will end in ${timeBetweenDates(currentTime, period["endTime"])}.`;
			}

			timeElem.innerHTML = `${formatDate(period["startTime"])} to ${formatDate(period["endTime"])}`;
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

let timer;
const periodElem = document.getElementById("period");
const timeElem = document.getElementById("timeRange");
const customizeFormElem = document.getElementById("customizeForm");
const reset = document.getElementById("reset");

async function run(completeRefresh) {
	const scheduleDB = await grabSchedules();
	if (!window.localStorage.getItem("periodNames")) createAvaliablePeriodsDB(scheduleDB);
	if (!window.localStorage.getItem("removedPeriods")) createRemovedPeriodsDB();

	if (completeRefresh) {
		populateModal(scheduleDB);
	}

	// Check for summer
	if (new Date(scheduleDB["about"]["endDate"]).getTime() < new Date().getTime() && new Date(scheduleDB["about"]["startDate"]).getTime() > new Date().getTime()) {
		periodElem.innerHTML = "No School!";
		timeElem.innerHTML = "Enjoy your summer!";
	}

	const correctScheduleName = await findCorrectSchedule(scheduleDB);
	if (correctScheduleName == null) {
		periodElem.innerHTML = "No School!";
		timeElem.innerHTML = "Enjoy your time off!";
		return;
	}

	const scheduleTimes = scheduleDB[correctScheduleName]["times"];
	countdown(scheduleTimes);
	timer = setInterval(() => {
		countdown(scheduleTimes);
	}, 1000);
}

reset.addEventListener("click", async () => {
	clearInterval(timer);
	localStorage.clear();
	run(true);
});

run(true);
