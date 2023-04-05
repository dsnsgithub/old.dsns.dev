const circle = document.getElementById("circle");
const box = document.getElementById("box");

const score = document.getElementById("score");
score.innerHTML = 0;

const time = document.getElementById("stopwatch")
time.innerHTML = 0 + " milliseconds";

document.getElementById("other").style.display = "none";

var dimensions;
var set;

var wait;
var trail;
var locationX;
var locationY;

function tracker(event) {
    var x = event.clientX;
    var y = event.clientY;
    locationX = (x - parseInt(circle.offsetWidth / 2)) + "px";
    locationY = (y - parseInt(circle.offsetHeight / 2)) + "px";
    circle.style.marginLeft = locationX;
    circle.style.marginTop = locationY;
}

function createApple(size) {
    trail = document.createElement("div");
    trail.classList.add("trail");

    trail.style.backgroundColor = "black";
    trail.style.width = (size + "vw");
    trail.style.height = (size + "vw");
    trail.style.borderRadius = (size + "vw");

    trail.addEventListener("click", checkCollision);
    trail.style.marginLeft = (Math.floor(Math.random() * (box.offsetWidth - 20)) + 10) + "px";
    trail.style.marginTop = (Math.floor(Math.random() * (box.offsetHeight - 20)) + 10) + "px";
    document.body.appendChild(trail);
}

function checkCollision() { 
    time.innerHTML = 0;
    trail.remove();
    createApple(dimensions)
    score.innerHTML++;
}

function stopWatch(limit) {
    time.innerHTML = (parseInt(time.innerHTML) + 1) + " milliseconds";

    if(time.innerHTML == limit) {
        alert("gg! you lost. refresh");
        clearInterval(wait);
    }
    
    if(score.innerHTML == 10) {
        alert("gg! you won. refresh");
        clearInterval(wait);
    }
}

function start(time, size) {
    dimensions = size;
    set = time;
    wait = setInterval(function() {stopWatch(set)}, 1);
    createApple(dimensions);

    document.getElementById("choices").style.display = "none";
    document.getElementById("other").style.display = "";
}