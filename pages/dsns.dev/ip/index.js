async function run() {
	const ipDIV = document.getElementById("ip");
	const userAgentDIV = document.getElementById("useragent");
	const screenResolutionDiv = document.getElementById("screenresolution");

	const res = await fetch("https://dsns.dev/cdn-cgi/trace").then(res => res.text());
	const trace = res.split("\n");

	ipDIV.innerHTML = trace[2].split("=")[1];

	const userAgent = trace[5].split("=")[1]
	const cleanUserAgent = userAgent.replace(/</g, "&lt;").replace(/>/g, "&gt;");
	userAgentDIV.innerHTML = cleanUserAgent;

	screenResolutionDiv.innerHTML = `${screen.width}x${screen.height}`;
}

run();
