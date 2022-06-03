// @ts-check
async function run() {
	const ipDIV = document.getElementById("ip");
	const userAgentDIV = document.getElementById("useragent");
	const screenResolutionDiv = document.getElementById("screenresolution");

	const headers = await fetch("/ipAPI").then((response) => response.json());

	ipDIV.innerHTML = headers["x-forwarded-for"];

	const cleanUserAgent = headers["user-agent"].replace(/</g, "&lt;").replace(/>/g, "&gt;");
	userAgentDIV.innerHTML = cleanUserAgent;

	screenResolutionDiv.innerHTML = `${screen.width}x${screen.height}`;
}

run();
