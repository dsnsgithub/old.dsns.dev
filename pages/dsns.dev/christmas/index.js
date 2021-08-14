// Set the date we're counting down to
var countDownDate = new Date("December 25, 2021").getTime();


function countdown() {
	// Get today's date and time
	var now = new Date().getTime();

	// Find the distance between now and the count down date
	var distance = countDownDate - now;

	var seconds = Math.floor(distance / 1000);

	// Display the result in the element with id="demo"
    document.getElementById("demo").innerHTML = seconds.toLocaleString("en-US");

	// If the count down is finished, write some text
	if (distance < 0) {
		clearInterval(x);
		document.getElementById("demo").innerHTML = "Merry Christmas 2021!";
	}
}

// Update the count down every 1 second
countdown();
var x = setInterval(countdown, 1000);
