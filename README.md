# dsns.dev

![screenshot](https://github.com/dsnsgithub/dsns.dev/blob/main/portfolio.png?raw=true)

An express server running adamsai.com, dsns.dev, mseung,dev and portobellomarina.com.

Created with: 
- Bulma
- Hypixel API
- BCrypt
- Express
- SSE (EventSource)
- HTML/CSS/JS

## How To Install

To launch the project locally, you'll need [Node.js](https://nodejs.org/en/) installed on your machine. Once you do, follow these steps:

1. Clone the Github Repository:
    ```
    git clone https://github.com/dsnsgithub/dsns.dev
    ```
2. Enter repository and install dependencies:
    ```
    cd dsns.dev
    npm install
    ```
4. Create a `.env` file with these properties:
    ```
    API_KEY = [type /api new on mc.hypixel.net to get API key]
    RELOAD_TIME = 60000
    HTTPS = false
    ```
5. Create the following .json files in the JSON folder:
    ```
    echo [] > codes.json
    echo [] > levels.json
    echo {} > passwords.json
    ```
6. Start the express server:
    ```
    node .
    ```

