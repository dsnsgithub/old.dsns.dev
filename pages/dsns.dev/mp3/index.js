async function downloadMP3() {
	try {
		const downloadLink = document.getElementById("downloadLink").value;
		let youtubeID = "";

		if (downloadLink.indexOf("youtu.be") > -1) {
			youtubeID = downloadLink.split("https://youtu.be/")[1];
		} else if (downloadLink.indexOf("youtube.com") > -1) {
			youtubeID = downloadLink.split("https://www.youtube.com/watch?v=")[1] || downloadLink.split("https://youtube.com/watch?v=")[1];
		}

		if (!youtubeID) {
			alert("Invalid Youtube Link");
			return;
		}

		const res = await fetch(`/ytmp3/${youtubeID}`);
		if (res.status !== 200) {
			const error = await res.json();
			alert(error["reason"]);
			return;
		}

		const blob = await res.blob();
		const url = window.URL.createObjectURL(blob);

		const a = document.createElement("a");
		a.href = url;
		a.download = `${youtubeID}.mp3`;
		document.body.appendChild(a);
		a.click();
		a.remove();

		window.URL.revokeObjectURL(url);
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
