const circle = document.getElementById("circle");
var locationX;
var locationY;

var penDown = false;

function enable() {
    if(penDown == true) {
        penDown = false;
        document.removeEventListener("mousemove", createTrail);
    } else {
        penDown = true;
        document.addEventListener("mousemove", createTrail);
    }
}

document.addEventListener("click", enable);

function tracker(event) {
    var x = event.clientX;
    var y = event.clientY;
    locationX = (x - parseInt(circle.offsetWidth / 2)) + "px";
    locationY = (y - parseInt(circle.offsetHeight / 2)) + "px";
    circle.style.marginLeft = locationX;
    circle.style.marginTop = locationY;
}

function createTrail() {
    var trail = document.createElement("div");
    trail.classList.add("trail");

    trail.style.marginLeft = locationX;
    trail.style.marginTop = locationY;

    document.body.appendChild(trail);
}

document.addEventListener("mousemove", tracker);