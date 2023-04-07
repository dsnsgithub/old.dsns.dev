const box = document.getElementById("box");
var wait;

function jumpscare() {
    box.style.display = "none";

    wait = setInterval(epilepsy, 10);

    document.getElementById("scare").currentTime += 6.0;
    document.getElementById("scare").play();
}

function epilepsy() {
    if(document.body.style.backgroundColor == "") {
        document.body.style.backgroundColor = "black";
    } else if(document.body.style.backgroundColor == "black") {
        document.body.style.backgroundColor = "";
    }
}