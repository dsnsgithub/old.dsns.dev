# dsns.dev

![dsns portfolio](https://github.com/dsnsgithub/dsns.dev/blob/main/portfolio.png?raw=true)

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
1. Download the repository from the [master](https://github.com/dsnsgithub/dsns.dev) branch on GitHub.
2. Extract the `dsns.dev-main.zip`.
3. Run `npm install` in the root directory (where the `package.json` file is found).
4. Create a `.env` file with these properties:
```
API_KEY = [type /api new on mc.hypixel.net to get api key]
RELOAD_TIME = 60000
HTTPS = false
```
5. Create the following .json files in the JSON folder:
```
codes.json => []
levels.json => []
passwords.json => {}
```
6. Run `node .` in the root directory.
