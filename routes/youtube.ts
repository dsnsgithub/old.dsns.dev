import ytdl from "ytdl-core";
import { Express } from "express";

module.exports = function (app: Express) {
	app.get("/api/youtube/:id", async (req, res, next) => {
		try {
			if (req.hostname != "dsns.dev" && req.hostname != "dsns.test") return next();
			if (!req.params.id) return res.status(400).send("Invalid YouTube Link");

			const videoInfo = await ytdl.getBasicInfo(req.params.id);
			const length = Number(videoInfo["videoDetails"]["lengthSeconds"]);

			if (length > 1800) {
				return res.status(400).send("Video over 30 minutes");
			}

			const fullLink = `https://www.youtube.com/watch?v=${req.params.id}`;

			let title = videoInfo.videoDetails.title;
			title = title.replace(/[^\w]/g, "_"); // \w is the same as [A-Za-z0-9_]
			title = title.substring(0, 100);

			res.setHeader("Content-Disposition", `attachment; filename="${title}.webm"`);
			res.setHeader("Content-Type", "audio/webm");
			res.setHeader("Access-Control-Expose-Headers", "Content-Disposition");

			ytdl(fullLink, {
				filter: "audioonly",
				quality: "highestaudio"
			}).pipe(res);
		} catch (error: any) {
			console.error("\x1b[31m" + "Error: Broken (GET) /api/youtube: " + (error.stack || error) + "\x1b[0m");
			return res.status(500).send(error);
		}
	});

	app.get("/api/youtubeVideo/:id", async (req, res, next) => {
		try {
			if (req.hostname != "dsns.dev" && req.hostname != "dsns.test") return next();
			if (!req.params.id) return res.status(400).send("Invalid YouTube Link");

			const info = await ytdl.getInfo(`https://www.youtube.com/watch?v=${req.params.id}`);

			let formats = info.formats;
			formats.sort((a, b) => {
				return (b.bitrate || 0) - (a.bitrate || 0);
			});

			formats = formats.filter((video) => video.mimeType && video.mimeType.includes("video/mp4"));

			return res.json({
				highestvideo: formats[0],
				highest: formats.filter((video) => video.hasAudio == true)[0]
			});
		} catch (error: any) {
			console.error("\x1b[31m" + "Error: Broken (GET) /api/youtubeVideo: " + (error.stack || error) + "\x1b[0m");
			return res.status(500).send(error);
		}
	});

	app.use((req, res, next) => {
		if (req.hostname != "dsns.dev" && req.hostname != "dsns.test") return next();

		if (!req.url.includes("/mp3")) return next();

		res.header("Cross-Origin-Opener-Policy", "same-origin");
		res.header("Cross-Origin-Embedder-Policy", "require-corp");
		next();
	});
};
