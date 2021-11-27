// @ts-check
const map = document.getElementById("mymap");

const mapListener = function (e) {
	const frame = document.createElement("iframe");
	frame.src = this.getAttribute("data-src");

	map.appendChild(frame);
	map.removeEventListener("mouseover", mapListener);
};

map.addEventListener("mouseover", mapListener);

// window.addEventListener("load", function (e) {
// 	setTimeout(function () {
// 		var map = document.getElementById("mymap");
// 		var frame = document.createElement("iframe");
// 		frame.src = map.getAttribute("data-src");
// 		map.appendChild(frame);
// 	}, 1500);
// });
