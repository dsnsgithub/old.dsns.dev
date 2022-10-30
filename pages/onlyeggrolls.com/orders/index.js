const resultTable = document.getElementById("resultTable");

async function grabOrders() {
	const response = await fetch("/api/fetchOrders").then((res) => res.json());

	if (response.length <= 0) {
		resultTable.innerHTML =
			"<h1 style='text-align:center;'>No Orders.</h1> <br> <h2 style='text-align:center;'>If you have ordered but it hasn't shown up, please <a href='/signup/'>login</a> to view account orders. <br> You must first link shopping sessions to an account to see them across devices.</h2>";
		return;
	}

	resultTable.createTHead();
	resultTable.createTBody();

	const headRow = resultTable.tHead.insertRow();
	headRow.insertCell().innerHTML = "Total Cost";
	headRow.insertCell().innerHTML = "Bought Items";
	headRow.insertCell().innerHTML = "CCN";

	for (const order of response) {
		const row = resultTable.insertRow();
		row.insertCell().innerHTML = "$" + order["totalPrice"];
		row.insertCell().innerHTML = order["boughtItems"];
		row.insertCell().innerHTML = order["ccn"];
	}
}

grabOrders();
