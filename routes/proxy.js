const { createProxyMiddleware, responseInterceptor } = require("http-proxy-middleware");

module.exports = function (app) {
	const options = {
		target: "https://tetr.io/",
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

	app.use(createProxyMiddleware((_, req) => req.headers.host.includes("tetr"), options));
};
