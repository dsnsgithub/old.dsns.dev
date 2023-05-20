async function whoIs() {
	const domainInput = document.getElementById("domain");
	const whois = document.getElementById("whois");
	const resultBox = document.getElementById("results");

	whois.innerText = "";

	const domain = domainInput.value;
	const result = await fetch("/api/whois/" + domain).then((res) => res.text());

	whois.innerHTML = result;
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
