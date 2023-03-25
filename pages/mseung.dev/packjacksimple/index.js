const comp = document.getElementById("compvalue");
comp.innerHTML = 12;

const player = document.getElementById("playervalue");
player.innerHTML = 12;

const pile = document.getElementById("pilevalue");
pile.innerHTML = 0;

const random = document.getElementById("random");

const field = document.getElementById("field");
const announcement = document.getElementById("announcement");
const submitbutton = document.getElementById("submitbutton");
const addbutton = document.getElementById("addbutton");
const removebutton = document.getElementById("removebutton");
const counters = document.getElementById("counters");

const sounds1 = document.getElementById("mutahar");
const sounds2 = document.getElementById("vineboom");
const sounds3 = document.getElementById("vineboomspam");
const sounds4 = document.getElementById("goofylaugh");
const sounds5 = document.getElementById("alarm");
const sounds6 = document.getElementById("ambatublou");
const sounds7 = document.getElementById("quandale");
const sounds8 = document.getElementById("packgod");
const picture = document.getElementById("laughingpointing");

const bMusic = document.getElementById("mrbeast")

var wait;
var wait2;
var restartTimeout;
var closepic;
var replaybMusic;

var playerbetted = 0;
var compbetted = 0;
var whowon;

addbutton.style.display = "none";
removebutton.style.display = "none";

replaybMusic = setInterval(backgroundMusic, 100);
function backgroundMusic() {
    bMusic.volume = 0.1;
    bMusic.play()
}

function stopMusic() {
    sounds1.volume = 0;
    sounds2.volume = 0;
    sounds3.volume = 0;
    sounds4.volume = 0;
    sounds5.volume = 0;
    sounds6.volume = 0;
    sounds7.volume = 0;
    sounds8.volume = 0;
    bMusic.volume = 0;
    clearInterval(replaybMusic);
    document.getElementById("shut").style.visibility = "hidden";
}

function submit() {
    if(Number(field.value) > 0 && Number(field.value) <= Number(player.innerHTML) && Number(field.value) % 1 == 0) {
        player.innerHTML = Number(player.innerHTML) - Number(field.value);
        playerbetted = Number(playerbetted) + Number(field.value);
        pile.innerHTML = Number(pile.innerHTML) + Number(field.value);
        counters.innerHTML = (("Player: " + playerbetted) + " Computer: " + compbetted);
        
        announcement.innerHTML = ("Player betted " + Number(field.value));
        
        submitbutton.style.display = "none";
        field.disabled = true;
        
        wait = setTimeout(compplay, Math.floor(Math.random() * 3000) + 800);
        function compplay() {
            clearTimeout(wait);
            var compnumber = Math.floor(Math.random() * Number(comp.innerHTML)) + 1;
        
            comp.innerHTML = Number(comp.innerHTML) - Number(compnumber);
            compbetted = Number(compbetted) + Number(compnumber);
            pile.innerHTML = Number(pile.innerHTML) + Number(compnumber);
            counters.innerHTML = (("Player: " + playerbetted) + " Computer: " + compbetted);
    
            announcement.innerHTML = ("Computer betted " + Number(compnumber));
        
            addbutton.style.display = "";
            removebutton.style.display = "";
            field.disabled = false;
        
            wait = setTimeout(go, 5000);
        }
    }
}

function add() {
    if(Number(field.value) > 0 && Number(field.value) <= Number(player.innerHTML) && Number(field.value) % 1 == 0) {
        player.innerHTML = Number(player.innerHTML) - Number(field.value);
        playerbetted = Number(playerbetted) + Number(field.value);
        pile.innerHTML = Number(pile.innerHTML) + Number(field.value);
        counters.innerHTML = (("Player: " + playerbetted) + " Computer: " + compbetted);
        addbutton.style.display = "none";
        removebutton.style.display = "none";
        field.disabled = true;
        clearTimeout(wait);
        wait = setTimeout(go, 5000);
        announcement.innerHTML = ("Player added " + Number(field.value));
        
        
        if(Math.random() < 0.6) { 
            if(Math.random() <= 0.5) {
                compnumber = Math.floor(Math.random() * Number(comp.innerHTML)) + 1;
                wait2 = setTimeout(compAdd, Math.floor(Math.random() * 3000) + 800); 
            } else {
                compnumber = Math.floor(Math.random() * Number(comp.innerHTML)) + 1;
                wait2 = setTimeout(compRemove, Math.floor(Math.random() * 3000) + 800); 
            }
        }
    }
}

function remove() {
    if(Number(field.value) <= Number(playerbetted) && Number(field.value) > 0 && Number(playerbetted) - Number(field.value) > 0 && Number(field.value) % 1 == 0) {
        player.innerHTML = Number(player.innerHTML) + Number(field.value);
        playerbetted = Number(playerbetted) - Number(field.value);
        pile.innerHTML = Number(pile.innerHTML) - Number(field.value);
        counters.innerHTML = (("Player: " + playerbetted) + " Computer: " + compbetted);
        addbutton.style.display = "none";
        removebutton.style.display = "none";
        field.disabled = true;
        clearTimeout(wait);
        wait = setTimeout(go, 5000);
        announcement.innerHTML = ("Player removed " + Number(field.value));
    
    
        if(Math.random() < 0.6) { 
            if(Math.random() <= 0.5) {
                compnumber = Math.floor(Math.random() * Number(comp.innerHTML)) + 1;
                wait2 = setTimeout(compAdd, Math.floor(Math.random() * 3000) + 800); 
            } else {
                compnumber = Math.floor(Math.random() * Number(comp.innerHTML)) + 1;
                wait2 = setTimeout(compRemove, Math.floor(Math.random() * 3000) + 800); 
            }
        }
    }
}

function compAdd() {
    clearTimeout(wait2);
    clearTimeout(wait);
    wait = setTimeout(go, 5000);
    comp.innerHTML = Number(comp.innerHTML) - Number(compnumber);
    compbetted = Number(compbetted) + Number(compnumber);
    pile.innerHTML = Number(pile.innerHTML) + Number(compnumber);
    counters.innerHTML = (("Player: " + playerbetted) + " Computer: " + compbetted);
    announcement.innerHTML = ("Computer added " + Number(compnumber));

    addbutton.style.display = "";
    removebutton.style.display = "";
    field.disabled = false;
}

function compRemove() {
    if(Number(compnumber) <= Number(compbetted) && Number(compnumber) > 0 && Number(comp.innerHTML) - Number(compnumber) > 0) {
        clearTimeout(wait2);
        clearTimeout(wait);
        wait = setTimeout(go, 5000);
        comp.innerHTML = Number(comp.innerHTML) + Number(compnumber);
        compbetted = Number(compbetted) - Number(compnumber);
        pile.innerHTML = Number(pile.innerHTML) - Number(compnumber);
        counters.innerHTML = (("Player: " + playerbetted) + " Computer: " + compbetted);
        announcement.innerHTML = ("Computer removed " + Number(compnumber));
    
        addbutton.style.display = "";
        removebutton.style.display = "";
        field.disabled = false;
    }
}

function go() {
    random.innerHTML = Math.floor(Math.random() * 9) + 1;
    clearTimeout(wait);

    if(random.innerHTML > 3) {
        if(playerbetted > compbetted) {
            announcement.innerHTML = "Player won with the highest!"
            whowon = "player";
            playSounds();
        } else if (playerbetted < compbetted) {
            announcement.innerHTML = "Computer won with the highest!"
            whowon = "computer";
            playSounds();
        } else {
            if(Math.random() > 0.5) {
                announcement.innerHTML = "Tiebreaker! Player won with the highest!"
                whowon = "player";
                playSounds()
            } else {
                announcement.innerHTML = "Tiebreaker! Computer won with the highest!"
                whowon = "computer";
                playSounds();
            }
        }
    } else if (random.innerHTML <= 3) {
        if(playerbetted < compbetted) {
            announcement.innerHTML = "Player won with the lowest!"
            whowon = "player";
            playSounds();
        } else if (playerbetted > compbetted) {
            announcement.innerHTML = "Computer won with the lowest!"
            whowon = "computer";
            playSounds();
        } else {
            if(Math.random() > 0.5) {
                announcement.innerHTML = "Tiebreaker! Player won with the lowest!"
                whowon = "player";
                playSounds();
            } else {
                announcement.innerHTML = "Tiebreaker! Computer won with the lowest!"
                whowon = "computer";
                playSounds();
            }
        }
    }


    function playSounds() {
        if(whowon == "computer") {
            if(Math.random() > 0.5) {
                picture.style.display = "";
                closepic = setTimeout(choose, 1500);
                function choose() {
                    clearTimeout(closepic); 

                    if(Math.random() < 0.333) {
                        picture.style.animationName = "spin";
                    } else if (Math.random() > 0.333 && Math.random() < 0.666) {
                        picture.style.animationName = "move";
                    } else {
                        picture.style.animationName = "";
                    }

                    closepic = setTimeout(close, 1500);
                }
    
                function close() {
                    picture.style.display = "none";
                }
    
                sounds4.play();
                sounds1.play();
                sounds3.play();
                setTimeout(function() {
                    sounds2.play();
                }, 5000);
            } else {
                picture.style.display = "";
                picture.src = "patrick.jpg"
                closepic = setTimeout(choose, 1500);
    
                function choose() {
                    clearTimeout(closepic); 

                    if(Math.random() < 0.333) {
                        picture.style.animationName = "spin";
                    } else if (Math.random() > 0.333 && Math.random() < 0.666) {
                        picture.style.animationName = "move";
                    } else {
                        picture.style.animationName = "";
                    }

                    closepic = setTimeout(close, 1500);
                }
                
                function close() {
                    picture.style.display = "none";
                }
            }

            sounds5.volume = 0.2;
            sounds5.play();
            setTimeout(function() {
                sounds6.play();
            }, 4000);
        } else if(whowon == "player") {

            if(Math.random() > 0.5) {
                picture.style.display = "";
                picture.src = "lightskin.jpg";
                closepic = setTimeout(choose, 1500);

                function choose() {
                    clearTimeout(closepic); 

                    if(Math.random() < 0.333) {
                        picture.style.animationName = "spin";
                    } else if (Math.random() > 0.333 && Math.random() < 0.666) {
                        picture.style.animationName = "move";
                    } else {
                        picture.style.animationName = "";
                    }

                    closepic = setTimeout(close, 1500);
                }

                function close() {
                    picture.style.display = "none";
                }

                sounds7.play();

            } else {
                picture.style.display = "";
                picture.src = "kyler.png";
                closepic = setTimeout(choose, 1500);

                function choose() {
                    clearTimeout(closepic); 

                    if(Math.random() < 0.333) {
                        picture.style.animationName = "spin";
                    } else if (Math.random() > 0.333 && Math.random() < 0.666) {
                        picture.style.animationName = "move";
                    } else {
                        picture.style.animationName = "";
                    }

                    closepic = setTimeout(close, 1500);
                }

                function close() {
                    picture.style.display = "none";
                }

                sounds8.play();
            }
        }

    }



    restartTimeout = setTimeout(restart, 5000);
    function restart() {
        clearTimeout(restartTimeout);

        submitbutton.style.display = "";
        addbutton.style.display = "none";
        removebutton.style.display = "none";
        field.disabled = false;

        field.value = "";
        counters.innerHTML = "";
        announcement.innerHTML = "";
        random.innerHTML = "";
        playerbetted = 0;
        compbetted = 0;

        if(whowon == "player") {
            player.innerHTML = Number(player.innerHTML) + Number(pile.innerHTML);
            pile.innerHTML = 0;
        } else if (whowon == "computer") {
            comp.innerHTML = Number(comp.innerHTML) + Number(pile.innerHTML);
            pile.innerHTML = 0;
        }

        if(Number(player.innerHTML) <= 0) {
            alert("Computer won! GG. Refresh the webpage to try again.");
        } else if(Number(comp.innerHTML) <= 0) {
            alert("Player won! GG. Refresh the webpage to try again.");
        }
    }
}