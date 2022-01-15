async function whoIs() {
	const domainInput = document.getElementById("domain");
	const whois = document.getElementById("whois");

	whois.innerHTML = "";

	const domain = domainInput.value;
	const result = await fetch("/whoisAPI/" + domain).then((res) => res.text());

	whois.innerHTML = result;
}

document.onkeyup = function (event) {
	if (event.key == "Enter") {
		event.preventDefault();
		whoIs();
	}
};
