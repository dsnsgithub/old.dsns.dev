let shoppingCartList = [];
let costList = [];

let totalCost = 0;

const totalCostElem = document.getElementById("totalCost");
const shoppingCartElem = document.getElementById("cart");

function addToShoppingCart(item, cost) {
	shoppingCartList.push(item);
	costList.push(cost);

	totalCost += cost;

	totalCostElem.textContent = `Total Cost: $${totalCost}`;

	const newItem = document.createElement("li");
	newItem.innerHTML = item;

	shoppingCartElem.appendChild(newItem);

}

function removeItem() {
	const removedCost = costList[costList.length - 1];
	costList.pop();

	totalCost = totalCost - removedCost;

	shoppingCartElem.removeChild(shoppingCartElem.lastElementChild);
	totalCostElem.innerHTML = `Total Cost: $${totalCost}`;
}


function completeTransaction() {
	alert(`Thanks for shopping at OnlyEggrolls!\nThe total cost of this purchase is $${totalCost}. `);
	shoppingCartElem.innerHTML = "";
	totalCost = 0;
	costList = [];
}