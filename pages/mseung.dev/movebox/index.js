const block = document.getElementById("block");
const obstacles = document.querySelectorAll("article");
const movable = document.getElementById("movable");
const end = document.getElementById("endzone");
const missile = document.getElementById("missile")

var marginX = 0;
var marginY = 0;

var marginX2 = 0;
var marginY2 = 0;

var wait;
var keydown = false;

var up;
var left;
var right;
var down;

var isTouchingMovable;
var isDisabled;

var dir;
var playerdir;

var playerClient;
var obstacleClient;
var movableClient;

var level = 0;

restart(false);

function move(event) {
    playerClient = block.getBoundingClientRect();

    function checkCollisionObstacle(addon) {
        for(let i=0; i<obstacles.length; i++) {
            obstacleClient = obstacles[i].getBoundingClientRect();
    
            if(playerClient.top + parseInt(block.offsetHeight) + addon == obstacleClient.top && playerClient.left + parseInt(block.offsetWidth) > obstacleClient.left && playerClient.right - parseInt(block.offsetWidth) < obstacleClient.right) {
                up = true;
            }
            if(playerClient.left + parseInt(block.offsetWidth) + addon == obstacleClient.left && playerClient.top + parseInt(block.offsetHeight) > obstacleClient.top && playerClient.bottom - parseInt(block.offsetHeight) < obstacleClient.bottom) {
                left = true;
            }
            if(playerClient.right - parseInt(block.offsetWidth) - addon == obstacleClient.right && playerClient.top + parseInt(block.offsetHeight) > obstacleClient.top && playerClient.bottom - parseInt(block.offsetHeight) < obstacleClient.bottom) {
                right = true;
            }
            if(playerClient.bottom - parseInt(block.offsetHeight) - addon == obstacleClient.bottom && playerClient.left + parseInt(block.offsetWidth) > obstacleClient.left && playerClient.right - parseInt(block.offsetWidth) < obstacleClient.right) {
                down = true;
            }
        }
    }  

    movableClient = movable.getBoundingClientRect();
    endClient = end.getBoundingClientRect();

    function checkCollisionMovable() {
        if(playerClient.top + parseInt(block.offsetHeight) == movableClient.top && playerClient.left + parseInt(block.offsetWidth) > movableClient.left && playerClient.right - parseInt(block.offsetWidth) < movableClient.right) {
            dir = "up";
            if(playerdir == "down") {
                isTouchingMovable = true;
            }
        } else if(playerClient.left + parseInt(block.offsetWidth) == movableClient.left && playerClient.top + parseInt(block.offsetHeight) > movableClient.top && playerClient.bottom - parseInt(block.offsetHeight) < movableClient.bottom) {
            dir = "left";
            if(playerdir == "right") {
                isTouchingMovable = true;
            }
        } else if(playerClient.right - parseInt(block.offsetWidth) == movableClient.right && playerClient.top + parseInt(block.offsetHeight) > movableClient.top && playerClient.bottom - parseInt(block.offsetHeight) < movableClient.bottom) {
            dir = "right";
            if(playerdir == "left") {
                isTouchingMovable = true;
            }
        } else if(playerClient.bottom - parseInt(block.offsetHeight) == movableClient.bottom && playerClient.left + parseInt(block.offsetWidth) > movableClient.left && playerClient.right - parseInt(block.offsetWidth) < movableClient.right) {
            dir = "bottom";
            if(playerdir == "up") {
                isTouchingMovable = true;
            }
        }
    }


    var e = event.key;

    checkCollisionObstacle(0);
    if(e == "ArrowUp") {
        playerdir = "up";
        check();
        if(down == false) {
            marginY = marginY - 50;
        }
    } else if(e == "ArrowDown") {
        playerdir = "down";
        check2();
        if(up == false) {
            marginY = marginY + 50;
        }
    } else if(e == "ArrowLeft") {
        playerdir = "left";
        check3();
        if(right == false) {
            marginX = marginX - 50;
        }
    } else if(e == "ArrowRight") {
        playerdir = "right";
        check4();
        if(left == false) {
            marginX = marginX + 50;
        }
    }

    function check() {
        checkCollisionMovable();
        if(isTouchingMovable == true) {
            checkCollisionObstacle(50);
        }
        if(dir == "bottom" && down == false) {
            marginY2 = marginY2 - 50;
        }
    }

    function check2() {
        checkCollisionMovable();
        if(isTouchingMovable == true) {
            checkCollisionObstacle(50);
        }
        if(dir == "up" && up == false) {
            marginY2 = marginY2 + 50;
        }
    }

    function check3() {
        checkCollisionMovable();
        if(isTouchingMovable == true) {
            checkCollisionObstacle(50);
        }
        if(dir == "right" && right == false) {
            marginX2 = marginX2 - 50;
        }
    }

    function check4() {
        checkCollisionMovable();
        if(isTouchingMovable == true) {
            checkCollisionObstacle(50);
        }
        if(dir == "left" && left == false) {
            marginX2 = marginX2 + 50;
        }
    }

    function checkOver() {
        if(movableClient.top == endClient.top && endClient.left == movableClient.left) {
            if(isDisabled == false) {
                restart(false);
            }
        }
    }

    movable.style.marginLeft = (marginX2 + "px");
    movable.style.marginTop = (marginY2 + "px");

    block.style.marginLeft = (marginX + "px");
    block.style.marginTop = (marginY + "px");

    movableClient = movable.getBoundingClientRect();
    checkOver();

    dir = "";
    up = false;
    down = false;
    right = false;
    left = false;
    isTouchingMovable = false;
    playerdir = "";
}

var x = 1;
var y;
var missileAtkSpd;

function restart(died) { 
    clearInterval(waitMissiles);
    clearInterval(missileAtkSpd);
    onetimepls = false;
    isDisabled = true;
    if(died != true) {
        level++;
    } else if(died == true) {
        level = 1;
    }
    if(level > 3) {
        document.getElementById("level").innerHTML = "You win!";
        document.getElementById("level").style.opacity = 1;
        document.getElementById("youwin").style.display = "";
        document.getElementById("pushingbox").style.display = "";
    } else {
        document.getElementById("level").innerHTML = level;
        document.getElementById("level").style.animationName = "slide";
        setTimeout(() => {
            marginX = 0;
            marginY = 0;
            marginX2 = 0;
            marginY2 = 0;
    
            movable.style.marginLeft = (marginX2 + "px");
            movable.style.marginTop = (marginY2 + "px");
        
            block.style.marginLeft = (marginX + "px");
            block.style.marginTop = (marginY + "px");
            if(died == true) {
                level++;
            }
            if(level > 1) {
                if(died == true) {
                    level--;
                }
                y = ("level" + x)
                document.getElementById(String(y)).style.display = "none";
                if(died != true) {
                    x++;
                } else if(died == true) {
                    x = 1;
                }
                console.log(x);
                y = ("level" + x)
                document.getElementById(String(y)).style.display = "";
            }
            if(level == 1) {
                clearInterval(missileAtkSpd);
                movable.style.left = "250px";
                movable.style.top = "100px";
                end.style.left = "550px";
                end.style.top = "50px";
            }
            if(level == 2) {
                movable.style.left = "100px";
                movable.style.top = "150px";
                end.style.left = "50px";
                end.style.top = "300px";
                missileAtkSpd = setInterval(function() {
                    missiles(0, 1000)
                }, 3000);
            }
            if(level == 3) {
                x = 1;
                y = ("level" + x)
                document.getElementById(String(y)).style.display = "none";
                x = 2;
                y = ("level" + x)
                document.getElementById(String(y)).style.display = "none";
                x++;
                y = ("level" + x);
                document.getElementById(String(y)).style.display = "";
                clearInterval(missileAtkSpd);
                missileAtkSpd = setInterval(function() {
                    missiles(0, 900)
                }, 1100);
                movable.style.left = "100px";
                movable.style.top = "100px";
                end.style.left = "350px";
                end.style.top = "700px";
            }
            setTimeout(() => {
                document.getElementById("level").style.animationName = "";
                isDisabled = false;
            }, 500)
        }, 1500)
    }
}

var seconds;
var waitMissiles;
var onetimepls
var missileSpeed;

function missiles(time, speed) {
    playerClient = block.getBoundingClientRect();
    movableClient = movable.getBoundingClientRect();
    missile.style.top = playerClient.top - 50 + "px";
    missile.style.left = playerClient.left - 50 + "px";
    missile.innerHTML = time;
    missile.style.display = "flex";
    function countdown() {
        if(time > 0) {
            time--;
            missile.innerHTML = time;
        } else {
            playerClient = block.getBoundingClientRect();
            movableClient = movable.getBoundingClientRect();
            if((playerClient.top >= parseInt(missile.style.top) && playerClient.top <= (parseInt(missile.style.top) + 150 - parseInt(block.offsetHeight)))) {
                if((playerClient.left >= parseInt(missile.style.left) && playerClient.left <= (parseInt(missile.style.left) + 150 - parseInt(block.offsetWidth)))) {
                    onetimepls = true;
                }
            }
            if((movableClient.top >= parseInt(missile.style.top) && movableClient.top <= (parseInt(missile.style.top) + 150 - parseInt(movable.offsetHeight)))) {
                if((movableClient.left >= parseInt(missile.style.left) && movableClient.left <= (parseInt(missile.style.left) + 150 - parseInt(movable.offsetWidth)))) {
                    onetimepls = true;
                }
            }
            if(onetimepls == true) {
                restart(true);
            }
            missile.style.display = "none";
            clearInterval(waitMissiles);
        }
    }
    waitMissiles = setInterval(countdown, speed);
}
document.addEventListener('keydown', function(event) {
    if(keydown) return;
    keydown = true;
    move(event);
    wait = setInterval(function() {
        move(event);
    }, 200);
}, false);

document.addEventListener('keyup', function() {
    keydown = false;
    clearInterval(wait);
}, false);

var date = new Date();

if(date.getHours() >= 19 || date.getHours() <= 6) {
    document.body.style.backgroundColor = "#070620";
    document.body.style.color = "white";
}