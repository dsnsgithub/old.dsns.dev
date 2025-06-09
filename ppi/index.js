const round = (number, decimalPlaces) => {
	const factorOfTen = Math.pow(10, decimalPlaces);
	return Math.round(number * factorOfTen) / factorOfTen;
};

const outputBox = document.getElementById("outputBox");

function calculatePPI() {
	const height = document.getElementById("height").value;
	const width = document.getElementById("width").value;
	const screenSize = document.getElementById("screenSize").value;
	const ppiElement = document.getElementById("ppi");

	//Calculate the diagonal length in pixels with the Pythagorean Theorem:
	const diagonal = Math.sqrt(Math.pow(height, 2) + Math.pow(width, 2));

	const ppi = diagonal / screenSize;

	ppiElement.innerText = round(ppi, 2);
	outputBox.style.display = "block";
}

document.onkeyup = function (event) {
	if (event.key == "Enter") {
		event.preventDefault();
		calculatePPI();
	}
};

const searchButton = document.getElementById("searchButton");
searchButton.addEventListener("click", calculatePPI);
