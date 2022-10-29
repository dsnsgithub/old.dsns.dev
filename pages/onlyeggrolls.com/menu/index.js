const totalCostElem = document.getElementById("totalCost");
const shoppingCartElem = document.getElementById("cart");

let shoppingCart = {
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
};

function calculateTotalCost() {
	let cost = 0;
	for (const item in shoppingCart) {
		cost += shoppingCart[item].cost * shoppingCart[item].quantity;
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

	for (const item in shoppingCart) {
		if (shoppingCart[item]["quantity"] > 0) {
			const newItem = document.createElement("li");
			newItem.innerHTML = `${shoppingCart[item]["name"]} - (x${shoppingCart[item]["quantity"]})`;
			newItem.innerHTML += `<button onclick="removeItem('${item}')" class="button is-danger is-small">-</button>`;

			shoppingCartElem.appendChild(newItem);
		} 
	}

	totalCostElem.textContent = `Total Cost: $${calculateTotalCost()}`;
}

function addToShoppingCart(item, cost) {
	shoppingCart[item]["quantity"] += 1;

	displayCart();
}

function removeItem(name) {
	if (shoppingCart[name]["quantity"] > 0) {
		shoppingCart[name]["quantity"] -= 1;
	}

	displayCart();
}

async function completeTransaction() {
	if (shoppingCart.length <= 0) {
		alert("Please buy at least one item before finalizing the purchase.");
		return;
	}

	window.location.href = "/finalize/";
}

async function getShoppingCart() {
	const fetchedCart = await fetch("/api/fetchCart").then((res) => res.json());
	shoppingCart = fetchedCart;

	displayCart();
}

getShoppingCart();
