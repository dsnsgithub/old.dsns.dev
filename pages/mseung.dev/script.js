let isToggled = false;

const list = document.getElementById("list");

function openMenu() {
    if(isToggled == false) {
        list.style.display = "flex";
        isToggled = true;
    } else if (isToggled == true) {
        list.style.display = "none";
        isToggled = false;
    }
}