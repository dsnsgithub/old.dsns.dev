var player = document.getElementById("player");
var cactoose1 = document.getElementById("cactoose1");
function jump() {
	if (player.classList != "animate") {
		player.classList.add("animate");
	}
	setTimeout(function () {
		player.classList.remove("animate");
	}, 500);
}

var checkCollision = setInterval(function () {
	var playerTop = parseInt(window.getComputedStyle(player).getPropertyValue("top"));
	var cactoose1Left = parseInt(window.getComputedStyle(cactoose1).getPropertyValue("left"));
	if (cactoose1Left < 205 && cactoose1Left > 155 && playerTop >= 570) {
		cactoose1.style.animation = "none";
		cactoose1.style.display = "none";
		alert("The cactoose hit you");
	}
}, 10);
