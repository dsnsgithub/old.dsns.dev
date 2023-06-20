export default {
	async fetch(request, env, ctx) {
		if (request.url.includes("/recentgames/")) {
			const uuid = request.url.split("/").pop();
			const result = await fetch(`https://api.hypixel.net/recentgames?uuid=${uuid}`, {
				headers: { "API-Key": env["API_KEY"] }
			});
			const data = await result.json();

			let response = new Response(JSON.stringify(data), { status: 200 });
			response.headers.set("access-control-allow-origin", "*");
			response.headers.set("access-control-allow-headers", "*");

			return response;
		} else if (request.url.includes("/status/")) {
			const uuid = request.url.split("/").pop();
			const result = await fetch(`https://api.hypixel.net/status?uuid=${uuid}`, {
				headers: { "API-Key": env["API_KEY"] }
			});
			const data = await result.json();

			let response = new Response(JSON.stringify(data), { status: 200 });
			response.headers.set("access-control-allow-origin", "*");
			response.headers.set("access-control-allow-headers", "*");

			return response;
		} else {
			let response = new Response("Not Found", { status: 404 });
			response.headers.set("access-control-allow-origin", "*");
			response.headers.set("access-control-allow-headers", "*");

			return response;
		}
	}
};
