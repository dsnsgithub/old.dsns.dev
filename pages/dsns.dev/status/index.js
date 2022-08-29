async function scaled(domainsArray) {
	const promises = domainsArray.map(async ([domain, expiryString]) => {
		const res = await fetch("/api/whois/" + domain).then((res) => res.text());
		const split = res.split("<br>");
		const string = split[6].replace(/[\r]/gm, "");
		const date = new Date(string.split(expiryString)[1]);
		const today = new Date();
		const difference = date.getTime() - today.getTime();
		const days = Math.ceil(difference / (1000 * 60 * 60 * 24));
		return {
			domain: domain,
			date: date.toLocaleDateString("en-US", {
				hour: "numeric",
				minute: "numeric",
				hour12: true
			}),
			days: days
		};
	});

	const results = await Promise.all(promises);

	// Create a column with a box and subtitle for each domain
	for (const domain in results) {
		const container = document.getElementById("domainContainer");

		const column = document.createElement("div");
		column.classList = "column is-narrow";

		const box = document.createElement("div");
		box.className = "box";

		const subtitle = document.createElement("h2");
		subtitle.className = "subtitle";
		subtitle.style.fontWeight = "bold";

		const domainDates = document.createElement("div");

		domainDates.innerHTML = "Expiration Date: " + results[domain].date + "<br>" + results[domain].days + ` day${results[domain].days == 1 ? "" : "s"} remaining`;

		const days = results[domain].days;
		const domainName = results[domain].domain;

		if (days < 0) {
			box.style.backgroundColor = "#F04F4F";
		} else if (days < 7) {
			box.style.backgroundColor = "#EEDC82";
		} else {
			box.style.backgroundColor = "#4BB543";
		}

		subtitle.innerHTML = domainName;
		column.appendChild(box);
		box.appendChild(subtitle);
		box.appendChild(domainDates);

		container.appendChild(column);
	}
}

scaled([
	["justeggrolls.com", "Registrar Registration Expiration Date: "],
	["dominic.dev", "Registry Expiry Date: "],
	["dominic.com", "Registrar Registration Expiration Date: "]
]);

