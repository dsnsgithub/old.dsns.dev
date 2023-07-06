let isToggled = false;

var x = 0;
var letterInterval;

const list = document.getElementById("list");
const text = document.getElementById("name");
const menu = document.getElementById("menubutton");
const words = "Max Seung";

function openMenu() {
	if (isToggled == false) {
		list.style.display = "flex";
		isToggled = true;
		menu.className = "far fa-folder-open";
	} else if (isToggled == true) {
		list.style.display = "none";
		isToggled = false;
		menu.className = "far fa-folder";
	}
}

function startup() {
	letterInterval = setInterval(addletter, 125);
	function addletter() {
		text.innerHTML = text.innerHTML + words.charAt(x); /*Adds letter to textbox*/
		x++;
		if (x >= words.length) {
			/*if done with the sentence*/
			clearInterval(letterInterval); /*stop making x go up*/
		}
	}
}

startup();

var aList = document.querySelectorAll("a");
var date = new Date();

if (date.getHours() >= 19 || date.getHours() <= 6) {
	document.body.style.backgroundColor = "#070620";
	document.body.style.color = "white";

	for (let i = 0; i < aList.length; i++) {
		aList[i].style.border = "2px solid white";
		aList[i].style.color = "white";
	}

	document.getElementById("sun").style.display = "none";
}
