let isToggled = false;

const menu = document.getElementById("menubutton");
const menuBar = document.getElementById("menubar");

function openMenu() {
    if (isToggled == false) {
        menu.style.animationName = "open";
        menuBar.style.animationName = "slide";
        menuBar.style.visibility = "visible";
        setTimeout(function unsheath() {
            isToggled = true;
        }, 2000)
    } else {
        menu.style.animationName = "close";
        menuBar.style.animationName = "sheathing";
        setTimeout(function sheath() {
            menuBar.style.visibility = "hidden";
            isToggled = false;
        }, 2000)
    }
}