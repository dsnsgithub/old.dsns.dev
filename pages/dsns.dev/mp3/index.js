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
			// Use ffmpeg.wasm to convert the downloaded webm file to an mp3 file
			const { createFFmpeg } = FFmpeg;

			const sourceBuffer = await fetch(`/api/youtube/${youtubeID}`).then((r) => r.arrayBuffer());

			// create the FFmpeg instance and load it
			const ffmpeg = createFFmpeg({ log: true });
			await ffmpeg.load();
			

			// create a progress bar that displays the progress of the conversion
			ffmpeg.setProgress(({ ratio }) => {
				document.getElementById("progressBar").value = ratio;
			});

			// write the WEBM to the FFmpeg file system
			ffmpeg.FS("writeFile", `${youtubeID}.webm`, new Uint8Array(sourceBuffer, 0, sourceBuffer.byteLength));

			// run the FFmpeg command-line tool, converting the WEBM into an MP3
			await ffmpeg.run("-i", `${youtubeID}.webm`, `${youtubeID}.mp3`);

			// read the MP3 file back from the FFmpeg file system
			const output = ffmpeg.FS("readFile", `${youtubeID}.mp3`);

			// download the MP3 file
			const blob = new Blob([output], { type: "audio/mpeg" });
			const url = URL.createObjectURL(blob);
			const a = document.createElement("a");
			a.href = url;
			a.download = `${youtubeID}.mp3`;
			a.click();
			URL.revokeObjectURL(url);
		} 
		else if (fileType == "webm") {
			window.open(`/api/youtube/${youtubeID}`, "_blank");
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
