function calculateTotalCost(shoppingCart) {
	let cost = 0;
	for (const item in shoppingCart) {
		cost += shoppingCart[item].cost * shoppingCart[item].quantity;
	}

	return cost;
}

const shoppingCartElem = document.getElementById("itemList");
const totalCostElem = document.getElementById("totalCost");

async function displayCart() {
	const shoppingCart = await fetch("/api/fetchCart").then((res) => res.json());
	shoppingCartElem.innerHTML = "";

	for (const item in shoppingCart) {
		if (shoppingCart[item]["quantity"] > 0) {
			const newItem = document.createElement("li");
			newItem.innerHTML = `${shoppingCart[item]["name"]} - (x${shoppingCart[item]["quantity"]})`;

			shoppingCartElem.appendChild(newItem);
		}
	}

	totalCostElem.textContent = `Total Cost: $${calculateTotalCost(shoppingCart)}`;
}

async function completeTransaction() {
	const response = await fetch("/api/accountInfo").then((res) => res.json());
	const fetchedCart = await fetch("/api/fetchCart").then((res) => res.json());

	fetchedCart["Billing"] = {
		uuid: response["uuid"],
		CCN: response["CCN"],
		CVV: response["CVV"],
		address: response["address"],
		zipCode: response["zipCode"],
		fullName: response["fullName"]
	};

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
			body: JSON.stringify({
				porkEggroll: {
					name: "Pork Eggrolls",
					quantity: 0,
					cost: 5
				},
				vegetableEggroll: {
					name: "Vegetable Eggrolls",
					quantity: 0,
					cost: 4
				},
				beefEggroll: {
					name: "Beef Eggrolls",
					quantity: 0,
					cost: 5
				},
				shrimpEggroll: {
					name: "Shrimp Eggrolls",
					quantity: 0,
					cost: 6
				},
				fountainDrink: {
					name: "Fountain Drink",
					quantity: 0,
					cost: 2
				}
			})
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
