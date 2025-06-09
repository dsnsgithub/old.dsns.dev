const outputBox = document.getElementById("outputBox");

function commonDates(date) {
	date = date.toLowerCase();

	if (date.includes("now") || date.includes("current") || date.includes("today")) {
		return new Date();
	}

	if (date.includes("yesterday")) {
		return new Date().setDate(new Date().getDate() - 1);
	}

	if (date.includes("tomorrow")) {
		return new Date().setDate(new Date().getDate() + 1);
	}

	if (date.includes("christmas")) {
		return new Date(new Date().getFullYear(), 11, 25);
	}

	if (date.includes("new year")) {
		return new Date(new Date().getFullYear(), 0, 1);
	}

	if (date.includes("valentine")) {
		return new Date(new Date().getFullYear(), 1, 14);
	}

	if (date.includes("thanksgiving")) {
		const calculateThanksgiving = (y) => new Date(y, 10, 1 + (((11 - new Date(y, 10, 1).getDay() + 7) % 7) + 21));
		return calculateThanksgiving(new Date().getFullYear());
	}

	return new Date(date);
}

function calculateDates() {
	const firstDate = commonDates(document.getElementById("date1").value);
	const secondDate = commonDates(document.getElementById("date2").value);

	const timeDifference = secondDate - firstDate;

	const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
	const hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
	const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
	const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

	const resultElem = document.getElementById("result");
	resultElem.innerText = days + " days, " + hours + " hours, " + minutes + " minutes, " + seconds + " seconds";

	outputBox.style.display = "block";
}

document.onkeyup = function (event) {
	if (event.key == "Enter") {
		event.preventDefault();
		calculateDates();
	}
};
