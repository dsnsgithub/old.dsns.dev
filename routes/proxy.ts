import { createProxyMiddleware, responseInterceptor } from "http-proxy-middleware";
import { Express } from "express";

module.exports = function (app: Express) {
	function createOptions(target: string, responseModifier: string) {
		return {
			target: target,
			changeOrigin: true,
			selfHandleResponse: true,
			followRedirects: true,
			ws: true,
			onProxyRes: responseInterceptor(async (responseBuffer, proxyRes, req, res) => {
				const contentHeader = proxyRes.headers?.["content-type"];
				if (!contentHeader || !req.headers.host) return responseBuffer;

				const contentType = contentHeader.toLowerCase();
				if (contentType.includes("text/") || contentType.includes("utf-8")) {
					const response = responseBuffer.toString("utf8");
					return response.replace(new RegExp(responseModifier, "g"), req.headers.host);
				}

				return responseBuffer;
			})
		};
	}

	app.use(createProxyMiddleware((_, req) => (req.headers.host || "").includes("tetr"), createOptions("https://tetr.io/", "tetr.io")));
	app.use(createProxyMiddleware((_, req) => (req.headers.host || "").includes("tinfoil"), createOptions("https://tinf0il.tech/", "tinf0il.tech")));
	app.use(createProxyMiddleware((_, req) => (req.headers.host || "").startsWith("status.dsns."), createOptions("https://stats.uptimerobot.com", "stats.uptimerobot.com")));
};
