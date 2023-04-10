const box = document.getElementById("box");
const scare = document.getElementById("scare");
const picture = document.getElementById("picture");
var wait;
var wait2;

function jumpscare() {
    box.style.display = "none";

    wait = setInterval(epilepsy, 10);

    scare.currentTime = 6.0;
    scare.play();
    wait2 = setInterval(replay, 5000);
}

function epilepsy() {
    if(document.body.style.backgroundColor == "") {
        document.body.style.backgroundColor = "black";
        picture.style.display = "";
    } else if(document.body.style.backgroundColor == "black") {
        document.body.style.backgroundColor = "";
        picture.style.display = "none";
    }
}

function replay() {
    scare.currentTime = 6.0;
    scare.play();
    console.log("hello")
}