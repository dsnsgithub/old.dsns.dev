let isToggled = false;

var x = 0;
var letterInterval;

const list = document.getElementById("list");
const text = document.getElementById("name");
const menu = document.getElementById("menubutton");
const words = "Max Seung";

function openMenu() {
    if(isToggled == false) {
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
        if(x >= words.length) { /*if done with the sentence*/
            clearInterval(letterInterval); /*stop making x go up*/
        }
    }
}

startup();