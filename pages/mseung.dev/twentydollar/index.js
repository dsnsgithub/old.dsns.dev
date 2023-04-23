const box = document.getElementById("box");
const field = document.getElementById("setnumber");
const tempofield = document.getElementById("tempofield");

let speed = 200;
/*--------*/

/*intervals and timeouts */
var wait;
/*-------*/

/*other variables */
var blocklist = [];
var x = -1;
/*-------*/


// why are you looking in this script?
// why are you looking in this script?
// why are you looking in this script?


/* add stuff */
function createNote() {
    var newNote = document.createElement("div");
    newNote.classList.add("block");
    newNote.classList.add("note");
    addtoBox(newNote);
}

function createDrum() {
    var newDrum = document.createElement("div");
    newDrum.classList.add("block");
    newDrum.classList.add("drum");
    addtoBox(newDrum);
}

function createConnect() {
    var newConnect = document.createElement("div");
    newConnect.classList.add("block");
    newConnect.classList.add("connect");
    addtoBox(newConnect);
}

function createTempo() {
    var newTempo = document.createElement("div");
    newTempo.classList.add("block");
    newTempo.classList.add("tempo");
    addtoBox(newTempo);
}

function createPause() {
    var newPause = document.createElement("div");
    newPause.classList.add("block");
    newPause.classList.add("pause");
    addtoBox(newPause);
}

function addtoBox(item) {
    switch(item.className) {
        case "block connect":
            item.innerHTML = "=";
            break;
        case "block pause":
            for(let i=0; i<Number(field.value) -1 ; i++) {
                var newPause = document.createElement("div");
                newPause.classList.add("block");
                newPause.classList.add("pause");
                blocklist.push(newPause);
            }
        default:
            item.innerHTML = Number(field.value);
            break;
    }

    blocklist.push(item)

    box.appendChild(item);
}
/*------------*/

/* others */
function remove() {
    if(blocklist.length > 0) {
        blocklist[blocklist.length - 1].remove();
        blocklist.pop();
    } 
}

function play() {
    wait = setInterval(read, speed)

    document.getElementById("play").innerHTML = "Stop";
    document.getElementById("play").onclick = stopInterval;
}

function read() {
    x++;
    if(blocklist[x] !== undefined) {
        x++;
        for(let i=0; i<blocklist.length; i++) {
            blocklist[i].style.border = "none";
        }

        checkinFront(blocklist[x]);

    } else {
        stopInterval();
    }
}

function check() {
    blocklist[x].style.border = "2px solid gold";
    switch(blocklist[x].className) {
        case "block note":
            playAudio("middlec.mp3", 0.75);
            break;
        case "block drum":
            playAudio("bassdrum.mp3", 2.25);
            break;
        case "block connect":
            break;
        case "block pause":
            break;
        case "block tempo":
            speed = parseInt(blocklist[x].innerHTML);
            read();
            clearInterval(wait);
            wait = setInterval(read, speed);
            break;
    }
}

function checkinFront(item) {
    if(item !== undefined) {
        switch(item.className) {
            case "block connect":
                x--;
                check();
                x += 2;
                check();
                break;
            default:
                x--;
                check();
                break;
        }
    } else {
        x--;
        check();
    }
}

function playAudio(source, time) {
    var newSound = new Audio();
    var soundsrc = document.createElement("source");
    soundsrc.type = "audio/mpeg";
    soundsrc.src = source;
    newSound.appendChild(soundsrc);
    newSound.currentTime = time;
    if(Number(blocklist[x].innerHTML) + 1 > 15) {
        alert("Maximum pitch is 14.");
    } else {
        newSound.playbackRate = Number(blocklist[x].innerHTML) + 1;
    }
    newSound.preservesPitch = false;
    if(soundsrc.getAttribute("src") === "bassdrum.mp3") {
        setTimeout(function() {
            newSound.currentTime = 0;
            newSound.pause();
        }, 500)
    }
    newSound.play();
}

function stopInterval() {
    clearInterval(wait);
    x = -1;
    speed = 200;

    for(let i=0; i<blocklist.length; i++) {
        blocklist[i].style.border = "none";
    }

    document.getElementById("play").innerHTML = "Play";
    document.getElementById("play").onclick = play;
}

function clearAll() {
    for(let i=0; i<blocklist.length; i++) {
        blocklist[i].remove();
    }
    blocklist = [];
}
/*------------*/