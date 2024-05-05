# old.dsns.dev

![screenshot](https://github.com/dsnsgithub/old.dsns.dev/blob/main/portfolio.png?raw=true)

An express server running [old.dsns.dev](https://old.dsns.dev) and [onlyeggrolls.com](https://onlyeggrolls.com).

Created with:

-   Bulma
-   Hypixel API
-   Express
-   HTML/CSS/JS

## How To Install

To launch the project locally, you'll need [Node.js](https://nodejs.org/en/) installed on your machine. Once you do, follow these steps:

### 1. Clone the Github Repository:

    git clone https://github.com/dsnsgithub/old.dsns.dev

### 2. Enter the repository and install dependencies:

    cd dsns.dev
    npm install

### 3. Create a `.env` file and add these properties:

    HTTPS = false
    NODE_ENV = development

    HYPIXEL = true
    API_KEY = [only used for /statistics and /player]
    RELOAD_TIME = 120000

    PROXY = false
    WHOIS = true
    YOUTUBE = true

    ONLYEGGROLLS = false

### 5. Start the express server:

    ts-node .
