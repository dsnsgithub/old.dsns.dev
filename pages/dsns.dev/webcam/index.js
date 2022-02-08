const video = document.getElementById("webcam");

if (navigator.mediaDevices.getUserMedia) {
	navigator.mediaDevices.getUserMedia({ video: true }).then(function (stream) {
		video.srcObject = stream;
	});
}
