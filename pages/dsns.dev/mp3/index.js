async function downloadMP3() {
	try {
		const downloadLink = document.getElementById("downloadLink").value;
		let youtubeID = "";

		if (downloadLink.indexOf("youtu.be") > -1) {
			youtubeID = downloadLink.split("https://youtu.be/")[1].slice(0, 11);
		} else if (downloadLink.indexOf("youtube.com") > -1) {
			youtubeID = downloadLink.split("https://www.youtube.com/watch?v=")[1].slice(0, 11) || downloadLink.split("https://youtube.com/watch?v=")[1].slice(0, 11);
		}

		if (!youtubeID) {
			alert("Invalid YouTube Link");
			return;
		}

		const fileType = document.getElementById("fileType").value;
		if (fileType == "mp3") { 
			window.location.href = `/ytmp3/${youtubeID}`;
		} 
		else if (fileType == "webm") {
			window.location.href = `/ytwebm/${youtubeID}`;
		}
	} catch (e) {
		console.log(e);
	}
}

const downloadButton = document.getElementById("downloadButton");
downloadButton.addEventListener("click", downloadMP3);

document.onkeyup = function (event) {
	if (event.key == "Enter") {
		event.preventDefault();
		downloadMP3();
	}
};

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);

if (urlParams.get("error") == "invalid_youtube_link") {
	alert("Invalid YouTube Link");
} else if (urlParams.get("error") == "video_too_long") {
	alert("Video over 10 minutes");
}
