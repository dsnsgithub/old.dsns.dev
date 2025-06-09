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
				"/static/fonts/poppins.woff2",
				"./sw.js",
				"/static/favicon/apple-touch-icon.png",
				"/static/favicon/favicon-32x32.png",
				"/static/favicon/favicon-16x16.png",
				"./icons/icon-192x192.png",
				"./icons/icon-256x256.png",
				"./icons/icon-384x384.png",
				"./icons/icon-512x512.png"
			];

			// import schedules
			const scheduleDB = await fetch("https://dsns.dev/schedule/dvhs/schedule.json").then((res) => res.json());
			for (const scheduleName in scheduleDB) {
				if (scheduleName == "about") continue;

				cachedList.push(`${scheduleDB["about"]["url"]}${scheduleName}.txt`);
			}

			return cache.addAll(cachedList);
		})
	);
});

// Our service worker will intercept all fetch requests
// and check if we have cached the file
// if so it will serve the cached file
self.addEventListener("fetch", (event) => {
	event.respondWith(
		caches
			.open(cacheName)
			.then((cache) => cache.match(event.request, { ignoreSearch: true }))
			.then((response) => {
				console.log(response)
				return response || fetch(event.request);
			})
	);
});
