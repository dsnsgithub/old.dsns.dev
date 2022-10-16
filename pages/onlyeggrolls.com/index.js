let isToggled = false;

const menu = document.getElementById("menubutton");
const menuBar = document.getElementById("menubar");

function openMenu() {
    if(isToggled == false) {
        menu.style.animationName = "open";
        menuBar.style.animationName = "slide";
        isToggled = true;
    } else {
        menu.style.animationName = "close";
        menuBar.style.animationName = "sheathing";
        isToggled = false;
    }
}