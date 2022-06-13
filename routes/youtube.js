// @ts-check

//? Requirements
const ytdl = require("ytdl-core");
const ffmpeg = require("fluent-ffmpeg");

module.exports = function (app) {
	app.get("/api/youtube/:id", async function (req, res, next) {
		try {
			if (req.hostname != "dsns.dev" && req.hostname != "dsns.test") return next();

			if (!req.params.id) {
				return res.redirect("/mp3/?error=invalid_youtube_link");
			}

			const videoInfo = await ytdl.getBasicInfo(req.params.id);
			const length = Number(videoInfo["videoDetails"]["lengthSeconds"]);

			if (length > 600) {
				return res.redirect("/mp3?error=video_too_long");
			}

			const fullLink = `https://youtube.com/watch?v=${req.params.id}`;

			if (req.query["fileType"] == "mp3") {
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
						console.error(err);
					})
					.run();
			} else if (req.query["fileType"] == "webm") {
				res.setHeader("Content-Disposition", `attachment; filename="${req.params.id}.webm"`);
				res.setHeader("Content-Type", "audio/webm");

				ytdl(fullLink, {
					filter: "audioonly",
					quality: "highestaudio"
				}).pipe(res);
			} else {
				return res.redirect("/mp3/?error=invalid_file_type");
			}
		} catch (err) {
			return res.redirect("/mp3/?error=invalid_youtube_link");
		}
	});
};
