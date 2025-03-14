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
					return response
						.replace(/domain:"[^"]*",domain_hash:"[^"]*",ch_domain:"[^"]*"/g, "domain:null,domain_hash:null,ch_domain:null")
						.replace(new RegExp(responseModifier, "g"), req.headers.host);
				}

				return responseBuffer;
			})
		};
	}

	app.use((req, res, next) => {
		res.header("Access-Control-Allow-Origin", "*");
		res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
		res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
		next();
	});

	app.use(createProxyMiddleware((_, req) => (req.headers.host || "").includes("tetr") && (req.headers.host || "").includes("onlyeggrolls"), createOptions("https://tetr.io/", "tetr.io")));
	app.use(createProxyMiddleware((_, req) => (req.headers.host || "").includes("splix") && (req.headers.host || "").includes("onlyeggrolls"), createOptions("https://splix.io/", "splix.io")));

	app.use(createProxyMiddleware((_, req) => (req.headers.host || "").includes("vray") && (req.headers.host || "").includes("dsns"), createOptions("http://10.3.3.172:81", "splix.io")));
	app.use(createProxyMiddleware((_, req) => (req.headers.host || "").includes("calopoly-server") && (req.headers.host || "").includes("dsns"), createOptions("http://10.3.3.172:4000", "splix.io")));
	
};
