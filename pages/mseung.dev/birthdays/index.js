const cards = document.getElementsByClassName("item");
const rows = document.getElementsByClassName("row");
const currentDate = document.getElementById("currentDate");
const birthdaypeople = document.getElementById("birthdaypeople");
const people = document.getElementById("people");

var names = ["Eatsand", "BearRitto", "Kdev", "Daniel", "!Pegasus", "Igloo", "Robux", "Bello", "Aj.", "Spaceboy", "Wowza", "Tomato", "Alpha", "DSNS", "Tricky", "Ralph", "Sean", "ActFartworm"];
var dates = ["0614", "0614", "0111", "1110", "0402", "0402", "0305", "0818", "0427", "0708", "0618", "0724", "0303", "0517", "0408", "1006", "0224", "1119"]
var colors = ["lightcoral", "lightsalmon", "lightyellow", "lightgreen", "lightblue", "pink"]
var oldDates = [];
var newDates = [];
var evenNewerDates = [];
var newNames = [];
var date = new Date();

var enableSection = false;

/*time thing so the colors will actually work thanks */
function checkTime() {
    if(date.getHours() >= 19 || date.getHours() <= 6) {
        document.body.style.backgroundColor = "#070620";
        document.body.style.color = "white";
        document.getElementById("container").style.backgroundColor = "#160f3a";
        colors = ["maroon", "darkorange", "goldenrod", "darkgreen", "darkblue", "purple"];  
    }
}
/*--------------------------------------------------- */

for(let i=0; i<names.length; i++) {
    oldDates.push(dates[i]);

    cards[i].style.backgroundColor = colors[Math.floor(Math.random() * colors.length) + 0];
    cards[i].innerHTML = names[i] + "<br>";
    cards[i].innerHTML = cards[i].innerHTML + dates[i].charAt(0) + dates[i].charAt(1) + "/" + dates[i].charAt(2) + dates[i].charAt(3);  
}

dates = dates.sort((a,b)=>a-b);
for(let i=0; i<dates.length-1; i++) {
    if(date.getMonth() + 1 > Number(dates[i].charAt(0) + dates[i].charAt(1))) {
        dates.push(dates.shift());
    }
}

var temp;

for(let i=0; i<names.length; i++) {
    newDates.push(dates[i])
    evenNewerDates.push(dates[i]);
}

var olderVar;
var onlyonce = false;
for(let i=0; i<names.length; i++) {
    onlyonceplz();
    onlyonce = true;
    olderVar = oldDates.indexOf(evenNewerDates[0]);
    evenNewerDates.splice(0, 1);
    if(oldDates.indexOf(evenNewerDates[0]) != olderVar) {
        newNames.push(names[oldDates.indexOf(evenNewerDates[0])]);
    } else if(oldDates.indexOf(evenNewerDates[0]) == olderVar) {
        newNames.push(names[oldDates.indexOf(evenNewerDates[0]) + 1]);
    }
}

function onlyonceplz() {
    if(onlyonce == false) {
        if(oldDates.indexOf(evenNewerDates[0]) != olderVar) {
            newNames.push(names[oldDates.indexOf(evenNewerDates[0])]);
        } else if(oldDates.indexOf(evenNewerDates[0]) == olderVar) {
            newNames.push(names[oldDates.indexOf(evenNewerDates[0]) + 1]);
        }
    }
}

for(let i=0; i<names.length; i++) {
    cards[i].style.backgroundColor = colors[Math.floor(Math.random() * colors.length) + 0];
    cards[i].innerHTML = newNames[i] + "<br>";
    cards[i].innerHTML = cards[i].innerHTML + newDates[i].charAt(0) + newDates[i].charAt(1) + "/" + newDates[i].charAt(2) + newDates[i].charAt(3);  
}

var enableBirthdays = false;
var birthdaynumber = 0;
var cardnumber = 0;
var row;
var card;
var birthdaylist = []

function check() {
    for(let i=0; i<names.length; i++) {
        if(Number(dates[i].charAt(0).toString() + (dates[i].charAt(1).toString())) === Number(date.getMonth()) + 1) {
            if(Number(dates[i].charAt(2).toString() + (dates[i].charAt(3).toString())) === Number(date.getDate())) {
                birthdaypeople.style.display = "flex";
                people.appendChild(cards[i]);
                enableBirthdays = true;
                birthdaynumber++;
                birthdaylist.push(cards[i]);
            } else {
                if(birthdaylist.includes(cards[i])) {
                    document.getElementById("row" + rows.length).append(birthdaylist.shift());
                    birthdaylist.splice(0, 1);
                    birthdaynumber--;
                }
            }
        } else {
            if(birthdaylist.includes(cards[i])) {
                document.getElementById("row" + rows.length).append(birthdaylist.shift());
                birthdaylist.splice(0, 1);
                birthdaynumber--;
            }
        }
        if(birthdaynumber == 0) {
            enableBirthdays = false;
            birthdaypeople.style.display = "none";
        }
    }
    if(enableBirthdays == true) {
        for(let x=1; x<rows.length+1; x++) {

            row = document.getElementById("row" + x);
            while(row.childElementCount < 4 && x<rows.length) {
                cardnumber++;
                card = cards[cardnumber]
                function keepChecking() {
                    if(birthdaylist.includes(card)) {
                        cardnumber++;
                        card = cards[cardnumber];
                        keepChecking();
                    } else {
                        return;
                    }
                }
                keepChecking();
                row.append(card);
            }
        }
    }
}

function removeBirthday() {

}

var oldVar;
var onlyonceagain = false;

setInterval(function() {
    oldVar = date.getDate();
    date = new Date();
    currentDate.innerHTML = date;
    checkTime();
    if(onlyonceagain == false) {
        onlyonceagain = true;
        check();
    }
    if(oldVar != date.getDate()) {
        check();
    }
}, 100)

check();

/*the time thing is up at the top if you are wondering */