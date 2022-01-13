async function run() {
	const ipDIV = document.getElementById("ip");
	const userAgentDIV = document.getElementById("useragent");
	const headers = await fetch("/ipAPI").then((response) => response.json());

	ipDIV.innerHTML = headers["x-forwarded-for"];
	cleanUserAgent = headers["user-agent"].replace(/</g, "&lt;").replace(/>/g, "&gt;");
	userAgentDIV.innerHTML = cleanUserAgent;
}

run();
