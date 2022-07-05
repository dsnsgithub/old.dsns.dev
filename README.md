# dsns.dev

![screenshot](https://github.com/dsnsgithub/dsns.dev/blob/main/portfolio.png?raw=true)

An express server running [dsns.dev](https://dsns.dev), [mseung.dev](https://mseung.dev), [portobellomarina.com](https://portobellomarina.com), and [orchardlakehouse.com](https://orchardlakehouse.com).

Created with:
- Bulma
- Hypixel API
- Express
- SSE (EventSource)
- HTML/CSS/JS

## How To Install

To launch the project locally, you'll need [Node.js](https://nodejs.org/en/) installed on your machine. Once you do, follow these steps:

### 1. Clone the Github Repository:
    git clone https://github.com/dsnsgithub/dsns.dev

### 2. Enter the repository and install dependencies:
    cd dsns.dev
    npm install

### 3. Create a `.env` file and add these properties:
	HTTPS = false
	NODE_ENV = development
	
	WHOIS = true
	YOUTUBE = true

	LEVEL = false
	RECENTGAMES = false

	API_KEY = [only needed for /difference and /recentgames]
	UUIDs = 557bafa10aad40bbb67207a9cefa8220, 9e6cdbe98a744a33b53941cb0efd8113, 769f1d98aeef49cd934b4202e1c5537f
	IGNs = DSNS, AmKale, jiebi
	RELOAD_TIME = 120000

### 5. Start the express server:
    node .
