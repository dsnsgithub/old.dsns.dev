// Modified CORS Proxy, inspired by https://gist.github.com/Kahtaf/e20515800054efcfb22830b4bc883880

const corsResponse = (body: BodyInit | null | undefined, init: ResponseInit | undefined) => {
	const response = new Response(body, init);
	response.headers.set("access-control-allow-origin", "*");
	response.headers.set("access-control-allow-headers", "*");

	return response;
};

export default {
	async fetch(request: Request): Promise<Response> {
		try {
			const url = new URL(request.url);
			const requestURL = "https://" + request.url.replace(`${url.origin}/`, "");

			const newRequest = new Request(requestURL, request);
			if (newRequest.headers.has("origin")) newRequest.headers.delete("origin");
			if (newRequest.headers.has("referer")) newRequest.headers.delete("referer");

			const res = await fetch(newRequest);
			return corsResponse(res.body, res);
		} catch {
			return corsResponse("Invalid URL.", { status: 400 });
		}
	}
};
