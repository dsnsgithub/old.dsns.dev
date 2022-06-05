// @ts-check

//? Requirements
const ytdl = require("ytdl-core");
const ffmpeg = require("fluent-ffmpeg");
const readline = require("readline");

module.exports = function (app) {
	try {
		app.get("/ytwebm/:id", async function (req, res) {
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

				res.setHeader("Content-Disposition", `attachment; filename="${req.params.id}.webm"`);
				res.setHeader("Content-Type", "audio/mpeg");

				ytdl(fullLink, {
					filter: "audioonly",
					quality: "highestaudio",
				}).pipe(res);

			} catch (err) {
				return res.redirect("/mp3/?error=invalid_youtube_link");
			}
		});
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

				let start = Date.now();

				ffmpeg(stream)
					.format("mp3")
					.audioBitrate(196)
					.output(res, { end: true })
					.on("progress", (p) => {
						readline.cursorTo(process.stdout, 0);
						process.stdout.write(`${p.targetSize}kb downloaded`);
					})
					.on("end", () => {
						console.log(`\ndone, thanks - ${(Date.now() - start) / 1000}s`);
					})
					.on("error", (err) => {
						console.log(err);
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
