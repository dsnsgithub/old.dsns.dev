/*-----------------------------------------*/
const chip1 = document.getElementById("chip1");
const chip2 = document.getElementById("chip2");

let chip1value = 1000;
let chip2value = 1000;

chip1.innerHTML = chip1value;
chip2.innerHTML = chip2value;
/*-----------------------------------------*/
const bet = document.getElementById("bet");
bet.innerHTML = 0;
/*-----------------------------------------*/
const betfield = document.getElementById("betinput");
/*-----------------------------------------*/

/*set up the stage-------------------------*/
const compdeck = [
	document.getElementById("compcard1"),
	document.getElementById("compcard2"),
	document.getElementById("compcard3"),
	document.getElementById("compcard4"),
	document.getElementById("compcard5")
];
const playerdeck = [
	document.getElementById("playercard1"),
	document.getElementById("playercard2"),
	document.getElementById("playercard3"),
	document.getElementById("playercard4"),
	document.getElementById("playercard5")
];

const colors = ["turquoise", "white", "gray", "pink", "#6865c2", "#bdc7c0", "#5abf64", "red", "orange", "yellow", "blue", "purple", "green"];

var [one, two, three, four, five, six, seven, eight, nine, ten, eleven, twelve, thirteen] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

let playervalue = 0;
let compvalue = 0;
let playerprice = 0;
let compprice = 0;
let playervalue1 = 0;
let compvalue1 = 0;
var wait;
let comppaid = 0;

function makeCards() {
	for (let x in compdeck) {
		compdeck[x].innerHTML = Math.floor(Math.random() * 13) + 0 + 1;
		compdeck[x].style.backgroundColor = colors[compdeck[x].innerHTML - 1];
	}

	for (let x in playerdeck) {
		playerdeck[x].innerHTML = Math.floor(Math.random() * 13) + 0 + 1;
		playerdeck[x].style.backgroundColor = colors[playerdeck[x].innerHTML - 1];
	}
}
makeCards();

/*----------------------------------------*/
let y = Math.floor(Math.random() * Number(chip2.innerHTML)) + 1;

function addBet() {
	if (Number(betfield.value) >= 1 && Number(betfield.value) <= Number(chip1.innerHTML)) {
		chip1value = chip1value - Number(betfield.value);
		bet.innerHTML = Number(bet.innerHTML) + Number(betfield.value);
		chip1.innerHTML = chip1value;
		betinput.disabled = true;
		document.getElementById("raise").disabled = true;
		compaddBet();
	}
}
function compaddBet() {
	chip2value = chip2value - y;
	bet.innerHTML = Number(bet.innerHTML) + y;
	chip2.innerHTML = chip2value;
	comppaid = comppaid + y;
	showCards();
}

function showCards() {
	for (let x in compdeck) {
		compdeck[x].style.visibility = "visible";
	}
	checkCards(playerdeck, playervalue);
	checkCards(compdeck, compvalue);
	function checkCards(deck, value) {
		/*get values of cards*/
		for (let x in deck) {
			if (Number(deck[x].innerHTML) == 1) {
				one = one + 1;
			} else if (Number(deck[x].innerHTML) == 2) {
				two = two + 1;
			} else if (Number(deck[x].innerHTML) == 3) {
				three = three + 1;
			} else if (Number(deck[x].innerHTML) == 4) {
				four = four + 1;
			} else if (Number(deck[x].innerHTML) == 5) {
				five = five + 1;
			} else if (Number(deck[x].innerHTML) == 6) {
				six = six + 1;
			} else if (Number(deck[x].innerHTML) == 7) {
				seven = seven + 1;
			} else if (Number(deck[x].innerHTML) == 8) {
				eight = eight + 1;
			} else if (Number(deck[x].innerHTML) == 9) {
				nine = nine + 1;
			} else if (Number(deck[x].innerHTML) == 10) {
				ten = ten + 1;
			} else if (Number(deck[x].innerHTML) == 11) {
				eleven = eleven + 1;
			} else if (Number(deck[x].innerHTML) == 12) {
				twelve = twelve + 1;
			} else if (Number(deck[x].innerHTML) == 13) {
				thirteen = thirteen + 1;
			}
		}
		if (one == 1 && two == 1 && three == 1 && four == 1 && thirteen == 1) {
			/*the igloo graph*/
			value = value + 6;
		} else if (one == 5 || two == 5 || three == 5 || four == 5 || five == 5 || six == 5 || seven == 5 || eight == 5 || nine == 5 || ten == 5 || eleven == 5 || twelve == 5 || thirteen == 5) {
			/*5 of a penguin */
			value = value + 5;
		} else if (one == 4 || two == 4 || three == 4 || four == 4 || five == 4 || six == 4 || seven == 4 || eight == 4 || nine == 4 || ten == 4 || eleven == 4 || twelve == 4 || thirteen == 4) {
			/*4 of a penguin */
			value = value + 4;
		} else if (one == 3 || two == 3 || three == 3 || four == 3 || five == 3 || six == 3 || seven == 3 || eight == 3 || nine == 3 || ten == 3 || eleven == 3 || twelve == 3 || thirteen == 3) {
			/*3 of a penguin */
			value = value + 3;
		} else if ((eleven == 1 && five == 1) || (seven == 1 && thirteen == 1) || (four == 1 && eight == 1) || (three == 1 && two == 1) || (six == 1 && two == 1) || (thirteen == 1 && one == 1)) {
			/*saturation duo*/
			value = value + 2;
		} else if (one == 2 || two == 2 || three == 2 || four == 2 || five == 2 || six == 2 || seven == 2 || eight == 2 || nine == 2 || ten == 2 || eleven == 2 || twelve == 2 || thirteen == 2) {
			/*paired penguins*/
			value = value + 1;
		}

		console.log(value);
		one = two = three = four = five = six = seven = eight = nine = ten = eleven = twelve = thirteen = 0;
		if (value == playervalue) {
			playervalue1 = value;
		} else if (value == compvalue) {
			compvalue1 = value;
		}
	}
	compare();
	function compare() {
		if (playervalue1 > compvalue1) {
			chip1.innerHTML = Number(chip1.innerHTML) + Number(bet.innerHTML);
			chip1.style.backgroundColor = "limegreen";
		} else if (playervalue1 < compvalue1) {
			chip2.innerHTML = Number(chip2.innerHTML) + Number(bet.innerHTML);
			chip2.style.backgroundColor = "limegreen";
		} else if (playervalue1 == compvalue1) {
			for (let x in playerdeck) {
				playerprice = playerprice + Number(playerdeck[x].innerHTML);
			}

			for (let x in compdeck) {
				compprice = compprice + Number(compdeck[x].innerHTML);
			}

			if (playerprice > compprice) {
				chip1.innerHTML = Number(chip1.innerHTML) + Number(bet.innerHTML);
				bet.innerHTML = 0;
				chip1.style.backgroundColor = "limegreen";
			} else if (playerprice < compprice) {
				chip2.innerHTML = Number(chip2.innerHTML) + Number(bet.innerHTML);
				bet.innerHTML = 0;
				chip2.style.backgroundColor = "limegreen";
			} else {
				chip1.innerHTML = Number(chip1.innerHTML) + Number(betfield.value);
				chip2.innerHTML = Number(chip2.innerHTML) + Number(comppaid);
			}
		}

		wait = setTimeout(waitfunct, 3000);
		function waitfunct() {
			clearTimeout(wait);
			bet.innerHTML = 0;
			betinput.disabled = false;
			document.getElementById("raise").disabled = false;
			chip1.style.backgroundColor = "lightslategray";
			chip2.style.backgroundColor = "lightslategray";
			for (let x in compdeck) {
				compdeck[x].style.visibility = "hidden";
			}

			if (chip1.innerHTML <= 0) {
				alert("You lose!");
			} else if (chip2.innerHTML <= 0) {
				alert("You win!");
			}

			y = Math.floor(Math.random() * Number(chip2.innerHTML)) + 1;
			betfield.value = "";
			makeCards();
		}
	}
}
