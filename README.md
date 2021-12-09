# dsns.dev

![screenshot](https://github.com/dsnsgithub/dsns.dev/blob/main/portfolio.png?raw=true)

An express server running [dsns.dev](https://dsns.dev), [mseung.dev](https://mseung.dev) and [portobellomarina.com](https://portobellomarina.com).

Created with: 
- Bulma
- Hypixel API
- Express
- SSE (EventSource)
- HTML/CSS/JS

## How To Install

To launch the project locally, you'll need [Node.js](https://nodejs.org/en/) installed on your machine. Once you do, follow these steps:

1. Clone the Github Repository:
	```
	git clone https://github.com/dsnsgithub/dsns.dev
	```

2. Enter the repository and install dependencies:
	```
	cd dsns.dev && npm install
	```

3. Create a `.env` file and add these properties:
	```
	API_KEY = [type /api new on mc.hypixel.net to get an API key]
	RELOAD_TIME = 60000
	HTTPS = false
	NODE_ENV = development
	```

4. Start the express server:
	```
	node .
	```

	or

	```
	chmod +x repeat.sh
	./repeat.sh
	```
	`(Ctrl+C to exit)`