const totalCostElem = document.getElementById("totalCost");
const shoppingCartElem = document.getElementById("cart");

let shoppingCart = [];

function calculateTotalCost() {
	let cost = 0;
	for (const item in shoppingCart) {
		cost += shoppingCart[item].cost;
	}

	return cost;
}

async function displayCart() {
	fetch("/api/addCart", {
		method: "POST",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json"
		},
		body: JSON.stringify(shoppingCart)
	});

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

	totalCostElem.textContent = `Total Cost: $${calculateTotalCost()}`;
}

function addToShoppingCart(item, cost) {
	shoppingCart.push({
		name: item,
		cost: cost
	});

	displayCart();
}

function removeItem() {
	if (shoppingCart.length <= 0) return;
	shoppingCart.pop();

	displayCart();
}

async function completeTransaction() {
	if (shoppingCart.length <= 0) {
		alert("Please buy at least one item before finalizing the purchase.");
		return;
	}

	const CCN = prompt("Enter a credit card number: ");
	shoppingCart.push({ name: "CCN", number: CCN });

	const res = await fetch("/api/purchase", {
		method: "POST",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json"
		},
		body: JSON.stringify(shoppingCart)
	});

	const response = await res.text();

	alert(response);

	if (res.status == 200) {
		shoppingCart = [];
	} else {
		shoppingCart.pop();
	}

	displayCart();
}

async function getShoppingCart() {
	const fetchedCart = await fetch("/api/fetchCart").then((res) => res.json());
	shoppingCart = fetchedCart;

	displayCart();
}

getShoppingCart();
