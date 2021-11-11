async function whoIs() {
	const domainInput = document.getElementById("domain");
	const whois = document.getElementById("whois");

	whois.innerHTML = "";

	const domain = domainInput.value;
	const result = await fetch("/whoisAPI/" + domain).then((res) => res.text());

	whois.innerHTML = result;
}

const input = document.getElementById("domain");

input.addEventListener("keyup", function (event) {
	// Number 13 is the "Enter" key on the keyboard
	if (event.keyCode === 13) {
		event.preventDefault();
		whoIs();
	}
});
