const { createProxyMiddleware, responseInterceptor } = require("http-proxy-middleware");

// ! Line 77 of http-proxy-middleware.js in http-proxy-middleware must be changed to:
// ! return contextMatcher.match(context, path, req) && this.proxyOptions.pathFilter(path, req);

module.exports = function (app) {
	app.use(
		createProxyMiddleware({
			target: "https://tetr.io/",
			pathFilter: function (path, req) {
				return req.headers.host.includes("tetr");
			},
			changeOrigin: true,
			selfHandleResponse: true,
			followRedirects: true,
			ws: true,
			onProxyRes: responseInterceptor(async (responseBuffer, proxyRes, req, res) => {
				const imageTypes = ["text/css", "text/html; charset=UTF-8", "text/javascript"];
				if (imageTypes.includes(proxyRes.headers["content-type"])) {
					const response = responseBuffer.toString("utf8"); // convert buffer to string
					return response.replace(/tetr.io/g, req.headers.host); // manipulate response and return the result
				}

				return responseBuffer;
			})
		})
	);

	app.use(
		createProxyMiddleware({
			target: "https://webosu.online/",
			pathFilter: function (path, req) {
				return req.headers.host.startsWith("oss.dsns");
			},
			changeOrigin: true,
			selfHandleResponse: true,
			followRedirects: true,
			ws: true,
			onProxyRes: responseInterceptor(async (responseBuffer, proxyRes, req, res) => {
				const imageTypes = ["text/css", "text/html; charset=UTF-8", "text/html; charset=utf-8", "text/javascript", "application/json", "application/javascript; charset=utf-8"];
				if (imageTypes.includes(proxyRes.headers["content-type"])) {
					const response = responseBuffer.toString("utf8"); // convert buffer to string
					return response
						.replace(/webosu.online/g, req.headers.host)
						.replace(/catboy.best/g, "catboybest.dsns.dev")
						.replace(/assets.ppy.sh/g, "assetsppysh.dsns.dev")
						.replace(/livescores.webosu.workers.dev/g, "livescores.dsns.dev")
				}

				return responseBuffer;
			})
		})
	);

	app.use(
		createProxyMiddleware({
			target: "https://catboy.best/",
			pathFilter: function (path, req) {
				return req.headers.host.startsWith("catboybest.dsns");
			},
			changeOrigin: true,
			selfHandleResponse: true,
			followRedirects: true,
			ws: true,
			onProxyRes: responseInterceptor(async (responseBuffer, proxyRes, req, res) => {
				const imageTypes = ["text/css", "text/html; charset=UTF-8", "text/html; charset=utf-8", "text/javascript", "application/json", "application/javascript; charset=utf-8"];
				if (imageTypes.includes(proxyRes.headers["content-type"])) {
					const response = responseBuffer.toString("utf8"); // convert buffer to string
					return response
						.replace(/catboy.best/g, "catboybest.dsns.dev")
						.replace(/assets.ppy.sh/g, "assetsppysh.dsns.dev")
						.replace(/livescores.webosu.workers.dev/g, "livescores.dsns.dev")
				}

				return responseBuffer;
			})
		})
	);

	app.use(
		createProxyMiddleware({
			target: "https://livescores.webosu.workers.dev/",
			pathFilter: function (path, req) {
				return req.headers.host.startsWith("livescores.dsns");
			},
			changeOrigin: true,
			selfHandleResponse: true,
			followRedirects: true,
			ws: true,
			onProxyRes: responseInterceptor(async (responseBuffer, proxyRes, req, res) => {
				const imageTypes = ["text/css", "text/html; charset=UTF-8", "text/html; charset=utf-8", "text/javascript", "application/json", "application/javascript; charset=utf-8"];
				if (imageTypes.includes(proxyRes.headers["content-type"])) {
					const response = responseBuffer.toString("utf8"); // convert buffer to string
					return response
						.replace(/catboy.best/g, "catboybest.dsns.dev")
						.replace(/assets.ppy.sh/g, "assetsppysh.dsns.dev")
						.replace(/livescores.webosu.workers.dev/g, "livescores.dsns.dev")
				}

				return responseBuffer;
			})
		})
	);

	app.use(
		createProxyMiddleware({
			target: "https://assets.ppy.sh/",
			pathFilter: function (path, req) {
				return req.headers.host.startsWith("assetsppysh.dsns");
			},
			changeOrigin: true,
			selfHandleResponse: true,
			followRedirects: true,
			ws: true,
			onProxyRes: responseInterceptor(async (responseBuffer, proxyRes, req, res) => {
				const imageTypes = ["text/css", "text/html; charset=UTF-8", "text/html; charset=utf-8", "text/javascript", "application/json", "application/javascript; charset=utf-8"];
				if (imageTypes.includes(proxyRes.headers["content-type"])) {
					const response = responseBuffer.toString("utf8"); // convert buffer to string
					return response
						.replace(/catboy.best/g, "catboybest.dsns.dev")
						.replace(/assets.ppy.sh/g, "assetsppysh.dsns.dev")
						.replace(/livescores.webosu.workers.dev/g, "livescores.dsns.dev")
				}

				return responseBuffer;
			})
		})
	);
};
