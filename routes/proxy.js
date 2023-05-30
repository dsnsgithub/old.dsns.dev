const { createProxyMiddleware, responseInterceptor } = require("http-proxy-middleware");

// ! Line 77 of http-proxy-middleware.js in http-proxy-middleware must be changed to:
// ! return contextMatcher.match(context, path, req) && this.proxyOptions.pathFilter(path, req);

module.exports = function (app) {
	const options = {
		target: "https://tetr.io/",
		pathFilter: function (path, req) {
			return req.headers.host.includes("tetr");
		},
		changeOrigin: true,
		selfHandleResponse: true,
		followRedirects: true,
		ws: true,
		onProxyRes: responseInterceptor(async (responseBuffer, proxyRes, req, res) => {
			const contentHeader = proxyRes.headers?.["content-type"] || proxyRes.headers?.["Content-Type"];
			if (!contentHeader) return responseBuffer;

			const contentType = contentHeader.toLowerCase();
			if (contentType.includes("text/") || contentType.includes("utf-8")) {
				const response = responseBuffer.toString("utf8");
				return response.replace(/tetr.io/g, req.headers.host);
			}

			return responseBuffer;
		})
	};

	app.use(createProxyMiddleware(options));
};
