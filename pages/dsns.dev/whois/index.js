async function whoIs() {
	const domainInput = document.getElementById("domain");
	const whois = document.getElementById("whois");
	const resultBox = document.getElementById("results");

	whois.innerHTML = "";

	const domain = domainInput.value;
	const result = await fetch("/api/whois/" + domain).then((res) => res.json());

	whois.innerHTML = "";

	for (const key in result) {
		whois.innerHTML += `<b>${key}: </b> ${result[key]} <br>`
		console.log(key)
	}

	resultBox.style.display = "";
}

document.onkeyup = function (event) {
	if (event.key == "Enter") {
		event.preventDefault();
		whoIs();
	}
};

const searchButton = document.getElementById("searchButton");
searchButton.addEventListener("click", whoIs);
