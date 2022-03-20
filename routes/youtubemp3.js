// @ts-check

//? Requirements
const ytdl = require("ytdl-core");

module.exports = function (app) {
	try {
		app.get("/ytmp3/:id", async function (req, res) {
			if (!req.params.id) {
				res.status(400).json({ reason: "Invalid Youtube Link" });
				return;
			}

			try {
				const videoInfo = await ytdl.getBasicInfo(req.params.id);
				const length = Number(videoInfo["videoDetails"]["lengthSeconds"]);

				if (length > 3600) {
					res.status(400).json({ reason: "Video is too long" });
					return;
				}

				const fullLink = `https://youtube.com/watch?v=${req.params.id}`;

				//? Using the link, download the audio from the youtube link and send it to the client
				ytdl(fullLink, {
					filter: "audioonly",
					quality: "highestaudio"
				}).pipe(res);

			} catch (err) {
				res.status(400).json({ reason: "Invalid Youtube Link" });
				return;
			}
		});
	} catch {
		console.log("Error while trying to create /ytmp3 route");
	}
	
};

