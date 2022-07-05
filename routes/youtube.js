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

			if (length > 1800) {
				return res.redirect("/mp3?error=video_too_long");
			}

			const fullLink = `https://youtube.com/watch?v=${req.params.id}`;

			res.setHeader("Content-Disposition", `attachment; filename="${req.params.id}.webm"`);
			res.setHeader("Content-Type", "audio/webm");

			ytdl(fullLink, {
				filter: "audioonly",
				quality: "highestaudio"
			}).pipe(res);
		} catch (err) {
			return res.redirect("/mp3/?error=invalid_youtube_link");
		}
	});

	app.use((req, res, next) => {
		if (req.hostname != "dsns.dev" && req.hostname != "dsns.test") return next();

		res.header("Cross-Origin-Opener-Policy", "same-origin");
		res.header("Cross-Origin-Embedder-Policy", "require-corp");
		next();
	});
};
