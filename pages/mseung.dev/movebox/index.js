const block = document.getElementById("block");
const obstacles = document.querySelectorAll("article");
const movable = document.getElementById("movable");
const end = document.getElementById("endzone");
const missile = document.getElementById("missile");

var marginX = 0;
var marginY = 0;

var marginX2 = 0;
var marginY2 = 0;

var wait;
var keydown = false;
var movevalue = 50;
var dividevalue = 1;

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

function move(event) {
	playerClient = block.getBoundingClientRect();

	function checkCollisionObstacle(addon) {
		for (let i = 0; i < obstacles.length; i++) {
			obstacleClient = obstacles[i].getBoundingClientRect();

			if (
				playerClient.top + parseInt(block.offsetHeight) + addon == obstacleClient.top &&
				playerClient.left + parseInt(block.offsetWidth) > obstacleClient.left &&
				playerClient.right - parseInt(block.offsetWidth) < obstacleClient.right
			) {
				up = true;
			}
			if (
				playerClient.left + parseInt(block.offsetWidth) + addon == obstacleClient.left &&
				playerClient.top + parseInt(block.offsetHeight) > obstacleClient.top &&
				playerClient.bottom - parseInt(block.offsetHeight) < obstacleClient.bottom
			) {
				left = true;
			}
			if (
				playerClient.right - parseInt(block.offsetWidth) - addon == obstacleClient.right &&
				playerClient.top + parseInt(block.offsetHeight) > obstacleClient.top &&
				playerClient.bottom - parseInt(block.offsetHeight) < obstacleClient.bottom
			) {
				right = true;
			}
			if (
				playerClient.bottom - parseInt(block.offsetHeight) - addon == obstacleClient.bottom &&
				playerClient.left + parseInt(block.offsetWidth) > obstacleClient.left &&
				playerClient.right - parseInt(block.offsetWidth) < obstacleClient.right
			) {
				down = true;
			}
		}
	}

	movableClient = movable.getBoundingClientRect();
	endClient = end.getBoundingClientRect();

	function checkCollisionMovable() {
		if (
			playerClient.top + parseInt(block.offsetHeight) == movableClient.top &&
			playerClient.left + parseInt(block.offsetWidth) > movableClient.left &&
			playerClient.right - parseInt(block.offsetWidth) < movableClient.right
		) {
			dir = "up";
			if (playerdir == "down") {
				isTouchingMovable = true;
			}
		} else if (
			playerClient.left + parseInt(block.offsetWidth) == movableClient.left &&
			playerClient.top + parseInt(block.offsetHeight) > movableClient.top &&
			playerClient.bottom - parseInt(block.offsetHeight) < movableClient.bottom
		) {
			dir = "left";
			if (playerdir == "right") {
				isTouchingMovable = true;
			}
		} else if (
			playerClient.right - parseInt(block.offsetWidth) == movableClient.right &&
			playerClient.top + parseInt(block.offsetHeight) > movableClient.top &&
			playerClient.bottom - parseInt(block.offsetHeight) < movableClient.bottom
		) {
			dir = "right";
			if (playerdir == "left") {
				isTouchingMovable = true;
			}
		} else if (
			playerClient.bottom - parseInt(block.offsetHeight) == movableClient.bottom &&
			playerClient.left + parseInt(block.offsetWidth) > movableClient.left &&
			playerClient.right - parseInt(block.offsetWidth) < movableClient.right
		) {
			dir = "bottom";
			if (playerdir == "up") {
				isTouchingMovable = true;
			}
		}
	}

	var e = event.key;

	checkCollisionObstacle(0);
	if (e == "ArrowUp") {
		playerdir = "up";
		check();
		if (down == false) {
			marginY = marginY - movevalue;
		}
	} else if (e == "ArrowDown") {
		playerdir = "down";
		check2();
		if (up == false) {
			marginY = marginY + movevalue;
		}
	} else if (e == "ArrowLeft") {
		playerdir = "left";
		check3();
		if (right == false) {
			marginX = marginX - movevalue;
		}
	} else if (e == "ArrowRight") {
		playerdir = "right";
		check4();
		if (left == false) {
			marginX = marginX + movevalue;
		}
	}

	function check() {
		checkCollisionMovable();
		if (isTouchingMovable == true) {
			checkCollisionObstacle(movevalue);
		}
		if (dir == "bottom" && down == false) {
			marginY2 = marginY2 - movevalue;
		}
	}

	function check2() {
		checkCollisionMovable();
		if (isTouchingMovable == true) {
			checkCollisionObstacle(movevalue);
		}
		if (dir == "up" && up == false) {
			marginY2 = marginY2 + movevalue;
		}
	}

	function check3() {
		checkCollisionMovable();
		if (isTouchingMovable == true) {
			checkCollisionObstacle(movevalue);
		}
		if (dir == "right" && right == false) {
			marginX2 = marginX2 - movevalue;
		}
	}

	function check4() {
		checkCollisionMovable();
		if (isTouchingMovable == true) {
			checkCollisionObstacle(movevalue);
		}
		if (dir == "left" && left == false) {
			marginX2 = marginX2 + movevalue;
		}
	}

	function checkOver() {
		if (movableClient.top == endClient.top && endClient.left == movableClient.left) {
			if (isDisabled == false) {
				restart(false);
			}
		}
	}

	movable.style.marginLeft = marginX2 + "px";
	movable.style.marginTop = marginY2 + "px";

	block.style.marginLeft = marginX + "px";
	block.style.marginTop = marginY + "px";

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
	if (level == 0) {
		document.getElementById("startscreen").style.display = "none";
	}
	clearInterval(waitMissiles);
	clearInterval(missileAtkSpd);
	onetimepls = false;
	isDisabled = true;
	if (died != true) {
		level++;
	} else if (died == true) {
		level = 1;
	}
	if (level > 3) {
		document.getElementById("level").innerHTML = "You win!";
		document.getElementById("level").style.opacity = 1;
		document.getElementById("youwin").style.display = "";
		document.getElementById("pushingbox").style.display = "";
		document.getElementById("cheering").play();
	} else {
		document.getElementById("level").innerHTML = level;
		document.getElementById("level").style.animationName = "slide";
		setTimeout(() => {
			marginX = 0;
			marginY = 0;
			marginX2 = 0;
			marginY2 = 0;

			movable.style.marginLeft = marginX2 + "px";
			movable.style.marginTop = marginY2 + "px";

			block.style.marginLeft = marginX + "px";
			block.style.marginTop = marginY + "px";
			if (died == true) {
				level++;
			}
			if (level > 1) {
				if (died == true) {
					level--;
				}
				y = "level" + x;
				document.getElementById(String(y)).style.display = "none";
				if (died != true) {
					x++;
				} else if (died == true) {
					x = 1;
				}
				y = "level" + x;
				document.getElementById(String(y)).style.display = "";
			}
			if (level == 1) {
				clearInterval(missileAtkSpd);
				movable.style.left = 250 / dividevalue + "px";
				movable.style.top = 100 / dividevalue + "px";
				end.style.left = 550 / dividevalue + "px";
				end.style.top = 50 / dividevalue + "px";
				movable.style.display = "";
				end.style.display = "";
				block.style.display = "";
				document.getElementById("level1").style.display = "";
			}
			if (level == 2) {
				movable.style.left = 100 / dividevalue + "px";
				movable.style.top = 150 / dividevalue + "px";
				end.style.left = 50 / dividevalue + "px";
				end.style.top = 300 / dividevalue + "px";
				missileAtkSpd = setInterval(function () {
					missiles(3, 350);
				}, 3000);
			}
			if (level == 3) {
				x = 1;
				y = "level" + x;
				document.getElementById(String(y)).style.display = "none";
				x = 2;
				y = "level" + x;
				document.getElementById(String(y)).style.display = "none";
				x++;
				y = "level" + x;
				document.getElementById(String(y)).style.display = "";
				clearInterval(missileAtkSpd);
				missileAtkSpd = setInterval(function () {
					missiles(3, 300);
				}, 1300);
				movable.style.left = 100 / dividevalue + "px";
				movable.style.top = 100 / dividevalue + "px";
				end.style.left = 350 / dividevalue + "px";
				end.style.top = 700 / dividevalue + "px";
			}
			setTimeout(() => {
				document.getElementById("level").style.animationName = "";
				isDisabled = false;
			}, 500);
		}, 1500);
	}
}

var seconds;
var waitMissiles;
var onetimepls;
var missileSpeed;
document.getElementById("launch").volume = 0.3;

function missiles(time, speed) {
	playerClient = block.getBoundingClientRect();
	movableClient = movable.getBoundingClientRect();
	missile.style.top = playerClient.top - movevalue + "px";
	missile.style.left = playerClient.left - movevalue + "px";
	missile.innerHTML = time;
	missile.style.display = "flex";
	document.getElementById("launch").play();
	function countdown() {
		if (time > 1) {
			time--;
			missile.innerHTML = time;
		} else {
			document.getElementById("launch").pause();
			document.getElementById("launch").currentTime = 0;
			document.getElementById("explosion").currentTime = 1.5;
			document.getElementById("explosion").play();

			playerClient = block.getBoundingClientRect();
			movableClient = movable.getBoundingClientRect();
			if (playerClient.top >= parseInt(missile.style.top) && playerClient.top <= parseInt(missile.style.top) + parseInt(missile.offsetWidth) - parseInt(block.offsetHeight)) {
				if (playerClient.left >= parseInt(missile.style.left) && playerClient.left <= parseInt(missile.style.left) + parseInt(missile.offsetWidth) - parseInt(block.offsetWidth)) {
					onetimepls = true;
				}
			}
			if (movableClient.top >= parseInt(missile.style.top) && movableClient.top <= parseInt(missile.style.top) + parseInt(missile.offsetWidth) - parseInt(movable.offsetHeight)) {
				if (movableClient.left >= parseInt(missile.style.left) && movableClient.left <= parseInt(missile.style.left) + parseInt(missile.offsetWidth) - parseInt(movable.offsetWidth)) {
					onetimepls = true;
				}
			}
			if (onetimepls == true) {
				restart(true);
			}
			missile.style.display = "none";
			clearInterval(waitMissiles);
		}
	}
	waitMissiles = setInterval(countdown, speed);
}
document.addEventListener(
	"keydown",
	function (event) {
		if (keydown) return;
		keydown = true;
		move(event);
		wait = setInterval(function () {
			move(event);
		}, 200);
	},
	false
);

document.addEventListener(
	"keyup",
	function () {
		keydown = false;
		clearInterval(wait);
	},
	false
);

var z = 1;
var plsonlyonce = false;
const media = window.matchMedia("(max-width: 1100px)");

function otherMedia(query) {
	if (query.matches) {
		block.style.width = block.offsetWidth * 0.5 + "px";
		block.style.height = block.offsetHeight * 0.5 + "px";
		end.style.width = end.offsetWidth * 0.5 + "px";
		end.style.height = end.offsetHeight * 0.5 + "px";
		movable.style.width = movable.offsetWidth * 0.5 + "px";
		movable.style.height = movable.offsetHeight * 0.5 + "px";
		missile.style.width = missile.offsetWidth * 0.5 + "px";
		missile.style.height = missile.offsetHeight * 0.5 + "px";
		missile.style.fontSize = "1rem";
		block.style.top = block.offsetTop * 0.5 + "px";
		block.style.left = block.offsetLeft * 0.5 + "px";
		end.style.top = end.offsetTop * 0.5 + "px";
		end.style.left = end.offsetLeft * 0.5 + "px";
		movable.style.top = movable.offsetTop * 0.5 + "px";
		movable.style.left = movable.offsetLeft * 0.5 + "px";
		checkMedia(query);
	}
}

function checkMedia(please) {
	if (z < 4) {
		var imrunningoutofnames = "level" + z;
		var l = document.getElementById(imrunningoutofnames);
		var levelarticles = l.querySelectorAll("article");

		if (please.matches) {
			movevalue = 25;
			dividevalue = 2;

			for (let i = 0; i < levelarticles.length; i++) {
				levelarticles[i].style.width = levelarticles[i].offsetWidth * 0.5 + "px";
				levelarticles[i].style.height = levelarticles[i].offsetHeight * 0.5 + "px";
				levelarticles[i].style.top = levelarticles[i].offsetTop * 0.5 + "px";
				levelarticles[i].style.left = levelarticles[i].offsetLeft * 0.5 + "px";
			}

			z++;
			checkMedia(please);
		}
	}
}

otherMedia(media);

document.getElementById("level1").style.display = "none";
document.getElementById("level2").style.display = "none";
document.getElementById("level3").style.display = "none";
block.style.display = "none";
end.style.display = "none";
movable.style.display = "none";
missile.style.display = "none";

var date = new Date();
var articleList = document.querySelectorAll("article");

if (date.getHours() >= 19 || date.getHours() <= 6) {
	document.body.style.backgroundColor = "#070620";
	document.body.style.color = "white";
	for (let t = 0; t < articleList.length; t++) {
		articleList[t].style.backgroundColor = "white";
	}
}
