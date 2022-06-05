// @ts-check

//? Requirements
const ytdl = require("ytdl-core");
const ffmpeg = require("fluent-ffmpeg");

module.exports = function (app) {
	try {
		app.get("/ytmp3/:id", async function (req, res) {
			if (!req.params.id) {
				return res.redirect("/mp3/?error=invalid_youtube_link");
			}

			try {
				const videoInfo = await ytdl.getBasicInfo(req.params.id);
				const length = Number(videoInfo["videoDetails"]["lengthSeconds"]);

				if (length > 600) {
					return res.redirect("/mp3?error=video_too_long");
				}

				const fullLink = `https://youtube.com/watch?v=${req.params.id}`;

				res.setHeader("Content-Disposition", `attachment; filename="${req.params.id}.mp3"`);
				res.setHeader("Content-Type", "audio/mpeg");

				//? Using the link, download the audio and send it to the client
				const stream = ytdl(fullLink, {
					quality: "highestaudio"
				});

				ffmpeg(stream)
					.format("mp3")
					.audioBitrate(196)
					.output(res, { end: true })
					.on("error", (err) => {
						return res.redirect("/mp3/?error=invalid_youtube_link");
					})
					.run();
			} catch (err) {
				return res.redirect("/mp3/?error=invalid_youtube_link");
			}
		});
	} catch {
		console.log("Error while trying to route /ytmp3");
	}
};
