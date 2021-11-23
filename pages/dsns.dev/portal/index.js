function calculateCoords() {
	const inputX = document.getElementById("inputX").value;
	const inputY = document.getElementById("inputY").value;
	const outputX = document.getElementById("outputX");
	const outputY = document.getElementById("outputY");

	outputX.innerHTML = inputX / 8;
	outputY.innerHTML = inputY / 8;
}
