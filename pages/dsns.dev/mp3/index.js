const { createFFmpeg } = FFmpeg;

const round = (number, decimalPlaces) => {
	const factorOfTen = Math.pow(10, decimalPlaces);
	return Math.floor(number * factorOfTen) / factorOfTen;
};

async function convertFileFormat(format, type, youtubeID) {
	// Use ffmpeg.wasm to convert the downloaded webm file to an mp3 file

	const downloadStatus = document.getElementById("downloadStatus");
	downloadStatus.innerHTML = "Downloading...";

	const response = await fetch(`/api/youtube/${youtubeID}`);

	if (response.status != 200) {
		alert(await response.text());
		downloadStatus.innerHTML = "Waiting for download to start...";
	}

	const sourceBuffer = await response.arrayBuffer();

	downloadStatus.innerHTML = "Download Complete";

	// create the FFmpeg instance and load it
	const ffmpeg = createFFmpeg({ log: true });
	await ffmpeg.load();

	// create a progress bar that displays the progress of the conversion
	ffmpeg.setProgress(({ ratio }) => {
		const conversionStatus = document.getElementById("conversionStatus");
		const percent = round(ratio * 100, 2);

		conversionStatus.innerHTML = percent + "%";
	});

	// write the WEBM to the FFmpeg file system
	ffmpeg.FS("writeFile", `audio.webm`, new Uint8Array(sourceBuffer, 0, sourceBuffer.byteLength));

	// run the FFmpeg command-line tool, converting the WEBM into an MP3
	await ffmpeg.run("-i", `audio.webm`, `audio.${format}`);

	// read the MP3 file back from the FFmpeg file system
	const output = ffmpeg.FS("readFile", `audio.${format}`);

	// download the MP3 file
	const blob = new Blob([output], { type: type });
	const url = URL.createObjectURL(blob);
	const a = document.createElement("a");
	a.href = url;
	a.download = `${youtubeID}.${format}`;
	a.click();
	URL.revokeObjectURL(url);

	ffmpeg.FS("unlink", `audio.webm`);
	ffmpeg.FS("unlink", `audio.${format}`);
}

async function downloadMP3() {
	try {
		const downloadLink = document.getElementById("downloadLink").value;
		let youtubeID = "";

		if (downloadLink.indexOf("youtu.be") > -1) {
			youtubeID = downloadLink.split("youtu.be/")[1].slice(0, 11);
		} else if (downloadLink.indexOf("youtube.com") > -1) {
			youtubeID = downloadLink.split("?v=")[1]?.slice(0, 11);
		}

		if (!youtubeID) {
			alert("Invalid YouTube Link");
			return;
		}

		const fileType = document.getElementById("fileType").value;

		if (fileType == "mp3") {
			await convertFileFormat("mp3", "audio/mpeg", youtubeID);
		} else if (fileType == "wav") {
			await convertFileFormat("wav", "audio/wav", youtubeID);
		} else if (fileType == "flac") {
			await convertFileFormat("flac", "audio/flac", youtubeID);
		} else if (fileType == "aac") {
			await convertFileFormat("aac", "audio/aac", youtubeID);
		} else if (fileType == "ogg") {
			await convertFileFormat("ogg", "audio/ogg", youtubeID);
		} else if (fileType == "webm") {
			// Download the webm file
			const response = await fetch(`/api/youtube/${youtubeID}`);

			if (response.status != 200) {
				alert(await response.text());
			}

			const blob = await response.blob();
			const url = window.URL.createObjectURL(blob);
			const a = document.createElement("a");
			a.href = url;
			a.download = `${youtubeID}.webm`;
			a.click();
			window.URL.revokeObjectURL(url);
		} else {
			const req = await fetch(`https://dsnsdev.dsnsrepl.repl.co/${youtubeID}`);

			if (req.status != 200) {
				alert(await req.text());
			} else {
				const response = await req.json();
				if (fileType == "mp4audio") window.open(response["highest"]["url"], "_blank");
				if (fileType == "mp4high") window.open(response["highestvideo"]["url"], "_blank");
			}
		}
	} catch (e) {
		console.error(e);
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
