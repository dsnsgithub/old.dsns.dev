const round = (number, decimalPlaces) => {
	const factorOfTen = Math.pow(10, decimalPlaces);
	return Math.floor(number * factorOfTen) / factorOfTen;
};

function ConfettiGenerator() {
	var e = {
			target: "canvas",
			max: "300",
			size: "1",
			animate: !0,
			props: ["circle", "square", "triangle", "line"],
			colors: [
				[165, 104, 246],
				[230, 61, 135],
				[0, 199, 228],
				[253, 214, 126]
			],
			clock: "25",
			rotate: !0,
			start_from_edge: !1,
			respawn: !0,
			interval: null,
			width: window.innerWidth,
			height: window.innerHeight
		},
		t = "object" == typeof e.target ? e.target : document.getElementById(e.target),
		r = t.getContext("2d"),
		a = [];
	function i(e, t) {
		e || (e = 1);
		var r = Math.random() * e;
		return t ? Math.floor(r) : r;
	}
	var o = e.props.reduce(function (e, t) {
		return e + (t.weight || 1);
	}, 0);
	function n() {
		var t =
			e.props[
				(function () {
					for (var t = Math.random() * o, r = 0; r < e.props.length; ++r) {
						var a = e.props[r].weight || 1;
						if (t < a) return r;
						t -= a;
					}
				})()
			];
		return {
			prop: t.type ? t.type : t,
			x: i(e.width),
			y: e.start_from_edge ? (e.clock >= 0 ? -10 : parseFloat(e.height) + 10) : i(e.height),
			src: t.src,
			radius: i(4) + 1,
			size: t.size,
			rotate: e.rotate,
			line: Math.floor(i(65) - 30),
			angles: [i(10, !0) + 2, i(10, !0) + 2, i(10, !0) + 2, i(10, !0) + 2],
			color: e.colors[i(e.colors.length, !0)],
			rotation: (i(360, !0) * Math.PI) / 180,
			speed: i(e.clock / 7) + e.clock / 30
		};
	}
	function s(t) {
		if (t) {
			var a = t.radius <= 3 ? 0.4 : 0.8;
			switch (((r.fillStyle = r.strokeStyle = "rgba(" + t.color + ", " + a + ")"), r.beginPath(), t.prop)) {
				case "circle":
					r.moveTo(t.x, t.y), r.arc(t.x, t.y, t.radius * e.size, 0, 2 * Math.PI, !0), r.fill();
					break;
				case "triangle":
					r.moveTo(t.x, t.y), r.lineTo(t.x + t.angles[0] * e.size, t.y + t.angles[1] * e.size), r.lineTo(t.x + t.angles[2] * e.size, t.y + t.angles[3] * e.size), r.closePath(), r.fill();
					break;
				case "line":
					r.moveTo(t.x, t.y), r.lineTo(t.x + t.line * e.size, t.y + 5 * t.radius), (r.lineWidth = 2 * e.size), r.stroke();
					break;
				case "square":
					r.save(), r.translate(t.x + 15, t.y + 5), r.rotate(t.rotation), r.fillRect(-15 * e.size, -5 * e.size, 15 * e.size, 5 * e.size), r.restore();
					break;
				case "svg":
					r.save();
					var i = new window.Image();
					i.src = t.src;
					var o = t.size || 15;
					r.translate(t.x + o / 2, t.y + o / 2), t.rotate && r.rotate(t.rotation), r.drawImage(i, (-o / 2) * e.size, (-o / 2) * e.size, o * e.size, o * e.size), r.restore();
			}
		}
	}
	return {
		render: function () {
			(t.width = e.width), (t.height = e.height), (a = []);
			for (var o = 0; o < e.max; o++) a.push(n());
			return requestAnimationFrame(function t() {
				for (var o in (r.clearRect(0, 0, e.width, e.height), a)) s(a[o]);
				!(function () {
					for (var t = 0; t < e.max; t++) {
						var r = a[t];
						r &&
							(e.animate && (r.y += r.speed),
							r.rotate && (r.rotation += r.speed / 35),
							((r.speed >= 0 && r.y > e.height) || (r.speed < 0 && r.y < 0)) &&
								(e.respawn ? ((a[t] = r), (a[t].x = i(e.width, !0)), (a[t].y = r.speed >= 0 ? -10 : parseFloat(e.height))) : (a[t] = void 0)));
					}
					a.every(function (e) {
						return void 0 === e;
					}) && _clear();
				})(),
					e.animate && requestAnimationFrame(t);
			});
		}
	};
}

const birthdays = [
	{ id: "DSNS", date: "May 17, 2022" },
	{ id: "jiebi", date: "February 10, 2022" },
	{ id: "Retsed", date: "October 30, 2021" },
	{ id: "idot777", date: "May 3, 2022" },
	{ id: "Armster15", date: "January 15, 2021" },
	{ id: "LonelySouls", date: "January 29, 2022" },
	{ id: "jakeybakers", date: "April 18, 2022" },
	{ id: "Node13", date: "September 24, 2021" },
	{ id: "meh~", date: "January 7, 2022" },
	{ id: "AmKale", date: "March 21, 2022" },
	{ id: "mikachu", date: "April 17, 2022" },
	{ id: "nsno", date: "November 1, 2021" },
	{ id: "Max_AS", date: "July 8, 2022" },
	{ id: "B0B643", date: "July 11, 2021" },
	{ id: "Potato.png", date: "July 25, 2022" },
	{ id: "euphoriials", date: "August 5, 2021" },
	{ id: "doctor doom", date: "November 10, 2021" },
	{ id: "goug", date: "March 7, 2022" },
	{ id: "Fud", date: "February 11, 2022" },
	{ id: "ploplo", date: "May 4, 2022" },
	{ id: "Archer2305", date: "February 23, 2022" },
	{ id: "zell", date: "January 2, 2023" },
	{ id: "SyntaxError", date: "August 23, 2022" },
	{ id: "Lion Mountain", date: "December 30, 2022" },
	{ id: "useryz351", date: "September 22, 2022" }
];

for (const singleBirthday of birthdays) {
	let birthdayDate = singleBirthday["date"];
	let birthdayDistance = new Date(birthdayDate) - new Date();

	while (birthdayDistance < -86400000) {
		const birthdayYear = birthdayDate.split(" ")[2];
		birthdayDate = birthdayDate.replace(birthdayYear, Number(birthdayYear) + 1);
		birthdayDistance = new Date(birthdayDate) - new Date();
	}

	singleBirthday["date"] = birthdayDate;
}

// Create a function that sorts the array of birthdays by date
birthdays.sort(function (a, b) {
	return new Date(a.date) - new Date(b.date);
});

for (const eachBirthday of birthdays) {
	const birthdayContainer = document.getElementById("birthdayContainer");

	const columnDiv = document.createElement("div");
	columnDiv.className = "column is-one-third-desktop is-one-third-tablet is-half-mobile mt-6";
	birthdayContainer.appendChild(columnDiv);

	const countdownText = document.createElement("p");
	columnDiv.appendChild(countdownText);

	const countdown = document.createElement("h1");
	columnDiv.appendChild(countdown);

	const countdownBar = document.createElement("progress");
	countdownBar.className = "progress is-normal is-info";
	countdownBar.setAttribute("max", 31536000000);
	columnDiv.appendChild(countdownBar);

	const countdownPercent = document.createElement("p");
	columnDiv.appendChild(countdownPercent);

	function increaseCountdown() {
		const countDownDate = new Date(eachBirthday["date"]).getTime();
		const now = new Date().getTime();
		const distance = countDownDate - now;

		if (distance > -86400000 && distance < 0) {
			countdown.innerHTML = `Happy Birthday ${eachBirthday["id"]}!`;
			countdownPercent.innerHTML = 100 + "%";
			countdownBar.value = 31536000000;

			turnConfettiOn();
		} else {
			// Time calculations for days, hours, minutes and seconds
			const days = Math.floor(distance / (1000 * 60 * 60 * 24));
			const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
			const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
			const seconds = Math.floor((distance % (1000 * 60)) / 1000);

			countdown.innerHTML = days + "d " + hours + "h " + minutes + "m " + seconds + "s ";
			countdownBar.setAttribute("value", 31536000000 - distance);
			countdownPercent.innerHTML = round(((31536000000 - distance) / 31536000000) * 100, 2) + "%";
			countdownText.innerHTML = `${eachBirthday["id"]}'s Birthday`;
		}
	}

	increaseCountdown();
	setInterval(increaseCountdown, 1000);
}

function turnConfettiOn() {
	turnConfettiOn = function () {};
	const confetti = new ConfettiGenerator();
	confetti.render();
}
