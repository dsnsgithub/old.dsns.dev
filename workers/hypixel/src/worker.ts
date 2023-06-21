export interface Env {
	API_KEY: string;
}

const corsResponse = (body: BodyInit | null | undefined, init: ResponseInit | undefined) => {
	const response = new Response(body, init);
	response.headers.set("access-control-allow-origin", "*");
	response.headers.set("access-control-allow-headers", "*");

	return response;
};

export default {
	async fetch(request: Request, env: Env): Promise<Response> {
		if (request.url.includes("/recentgames/")) {
			const uuid = request.url.split("/").pop();
			const result = await fetch(`https://api.hypixel.net/recentgames?uuid=${uuid}`, {
				headers: { "API-Key": env["API_KEY"] }
			});
			const data = await result.json();

			return corsResponse(JSON.stringify(data), { status: result.status });
		} else if (request.url.includes("/status/")) {
			const uuid = request.url.split("/").pop();
			const result = await fetch(`https://api.hypixel.net/status?uuid=${uuid}`, {
				headers: { "API-Key": env["API_KEY"] }
			});
			const data = await result.json();

			return corsResponse(JSON.stringify(data), { status: result.status });
		} else {
			return corsResponse("Not Found.", { status: 404 });
		}
	}
};
