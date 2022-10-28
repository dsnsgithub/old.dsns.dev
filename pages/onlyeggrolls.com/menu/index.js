const totalCostElem = document.getElementById("totalCost");
const shoppingCartElem = document.getElementById("cart");

let shoppingCartList = [];
let costList = [];

let totalCost = 0;

function addToShoppingCart(item, cost) {
	shoppingCartList.push(item);
	costList.push(cost);

	totalCost += cost;
	totalCostElem.textContent = `Total Cost: $${totalCost}`;

	const newItem = document.createElement("li");
	newItem.innerHTML = item;

	if (item == "Pork Eggrolls ($5)") {
		newItem.style.color = "pink";
	}
	if (item == `Vegetable Eggrolls ($4)`) {
		newItem.style.color = "yellowgreen";
	}
	if (item == `Beef Eggrolls ($5)`) {
		newItem.style.color = "#693D3D";
	}
	if (item == `Shrimp Eggrolls ($6)`) {
		newItem.style.color = "#f7c7a9";
	}
	if (item == `Fountain Drink ($2)`) {
		newItem.style.color = "lightblue";
	}

	shoppingCartElem.appendChild(newItem);
}

function removeItem() {
	if (totalCost <= 0) return;

	const removedCost = costList[costList.length - 1];
	costList.pop();

	totalCost = totalCost - removedCost;
	shoppingCartElem.removeChild(shoppingCartElem.lastElementChild);
	totalCostElem.innerHTML = `Total Cost: $${totalCost}`;
}

function completeTransaction() {
	if (totalCost <= 0) {
		alert("Please buy at least one item before finalizing the purchase.");
		return;
	}

	alert(`Thanks for shopping at OnlyEggrolls!\nThe total cost of this purchase is $${totalCost}. `);
	shoppingCartElem.innerHTML = "";
	totalCost = 0;
	costList = [];
}
