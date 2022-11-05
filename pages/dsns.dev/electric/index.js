const round = (number, decimalPlaces) => {
	const factorOfTen = Math.pow(10, decimalPlaces);
	return Math.floor(number * factorOfTen) / factorOfTen;
};

function calculate() {
	const priceperKwh = document.getElementById("priceperKwh").value;
	const milesPerGallon = document.getElementById("milesPerGallon").value;
	const wattsPerMile = document.getElementById("wattsPerMile").value;
	const pricePerGallon = document.getElementById("pricePerGallon").value;

	const costElem = document.getElementById("cost");

	const kWhperMile = wattsPerMile / 1000;
	const kWhperGallon = kWhperMile * milesPerGallon;
	const cost = kWhperGallon * priceperKwh;

	costElem.innerText = `$${round(cost, 2)} per gallon equivalent`;
	costElem.innerHTML += "<br>";
	costElem.innerText += `${round(pricePerGallon / priceperKwh / kWhperMile, 2)} mpg equivalent`;
}

const calculateElem = document.getElementById("calculate");
calculateElem.addEventListener("click", calculate);
