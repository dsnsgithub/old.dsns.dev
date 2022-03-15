async function downloadMP3() {
	try {
		const downloadLink = document.getElementById("downloadLink");
		const youtubeID = downloadLink.value.split("https://www.youtube.com/watch?v=")[1];

		if (!youtubeID) {
			alert("Invalid Youtube Link");
			return;
		}

		const res = await fetch(`/ytmp3/${youtubeID}`)
		if (res.status !== 200) { 
			alert("Invalid Youtube Link");
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
		
	} catch(e) {
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