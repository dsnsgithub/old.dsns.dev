function calculateTotalCost(shoppingCart) {
	let cost = 0;
	for (const item in shoppingCart) {
		cost += shoppingCart[item].cost;
	}

	return cost;
}

const shoppingCartElem = document.getElementById("itemList");
const totalCostElem = document.getElementById("totalCost");

async function displayCart() {
	const shoppingCart = await fetch("/api/fetchCart").then((res) => res.json());

	shoppingCartElem.innerHTML = "";

	for (const item of shoppingCart) {
		const newItem = document.createElement("li");
		newItem.innerHTML = item["name"] + ` ($${item["cost"]})`;

		if (item["name"] == "Pork Eggrolls") {
			newItem.style.color = "pink";
		}
		if (item["name"] == `Vegetable Eggrolls`) {
			newItem.style.color = "yellowgreen";
		}
		if (item["name"] == `Beef Eggrolls`) {
			newItem.style.color = "#693D3D";
		}
		if (item["name"] == `Shrimp Eggrolls`) {
			newItem.style.color = "#f7c7a9";
		}
		if (item["name"] == `Fountain Drink`) {
			newItem.style.color = "lightblue";
		}

		shoppingCartElem.appendChild(newItem);
	}

	totalCostElem.textContent = `Total Cost: $${calculateTotalCost(shoppingCart)}`;
}

async function completeTransaction() {
	const response = await fetch("/api/accountInfo").then((res) => res.json());
	const fetchedCart = await fetch("/api/fetchCart").then((res) => res.json());

	fetchedCart.push({
		name: "Billing",
		payment: {
			uuid: response["uuid"],
			CCN: response["CCN"],
			CVV: response["CVV"],
			address: response["address"],
			zipCode: response["zipCode"],
			fullName: response["fullName"]
		}
	});

	const shoppingResponse = await fetch("/api/purchase", {
		method: "POST",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json"
		},
		body: JSON.stringify(fetchedCart)
	});

	alert(await shoppingResponse.text());

	if (shoppingResponse.status == 200) {
		await fetch("/api/addCart", {
			method: "POST",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json"
			},
			body: JSON.stringify([])
		});

		window.location.href = "/menu/";
	}
}

async function addAccount() {
	const accountElem = document.getElementById("accountElem");
	const submitButton = document.getElementById("submitButton");

	const res = await fetch("/api/accountInfo");

	if (res.status != 200) {
		accountElem.innerHTML = "No Account. <br>Please make an account by clicking <a href='/signup/'>here</a> before continuing.";
		submitButton.setAttribute("disabled", true);
	} else {
		const response = await res.json();
		accountElem.innerText = "Account: " + response["email"];
	}
}
// completeTransaction();
addAccount();
displayCart();
