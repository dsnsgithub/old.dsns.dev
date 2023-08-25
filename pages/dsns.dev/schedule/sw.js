const cacheName = "schedules";

// Cache all the files to make a PWA
self.addEventListener("install", (e) => {
	e.waitUntil(
		caches.open(cacheName).then(async (cache) => {
			// Our application only has two files here index.html and manifest.json
			// but you can add more such as style.css as your app grows
			let cachedList = [
				"./",
				"./index.html",
				"./manifest.json",
				"./index.js",
				"./dvhs/schedule.json",
				"/static/css/bulma.min.css",
				"/static/css/static.css",
				"/static/images/jpg/icon.jpg",
				"/static/fonts/icomoon.woff",
				"/static/fonts/poppins.woff2"
			];

			// import schedules
			const scheduleDB = await fetch("https://dsns.dev/schedule/dvhs/schedule.json").then((res) => res.json());
			for (const scheduleName in scheduleDB) {
				if (scheduleName == "about") continue;

				cachedList.push(`${scheduleDB["about"]}${scheduleName}.txt`);
			}

			return cache.addAll(cachedList);
		})
	);
});

// Our service worker will intercept all fetch requests
// and check if we have cached the file
// if so it will serve the cached file
self.addEventListener("fetch", (event) => {
	console.log(`[Service Worker] Fetched resource ${event.request.url}`);

	event.respondWith(
		caches
			.open(cacheName)
			.then((cache) => cache.match(event.request, { ignoreSearch: true }))
			.then((response) => {
				return response || fetch(event.request);
			})
	);
});
