# adamsai.com
This webpage was created to display the difference in Hypixel Level between AmKale, DSNS, and jiebi.

This project was created with the Hypixel API, Express, and Ejs.


## How To Install

To launch the project locally, you'll need [Node.js](https://nodejs.org/en/) installed on your machine. Once you do, follow these steps:
1. Download the repository from the [master](https://github.com/dsnsgithub/adamsai.com) branch on GitHub.
2. Extract the `adamsai.com-main.zip`.
3. Run `npm install` in the root directory (where the `package.json` file is found).
4. Create a `.env` file with these properties:
```
API_KEY = [type /api new on mc.hypixel.net to get api key]
RELOAD_TIME = 60000
HTTPS_KEY = [put path to HTTPS privkey.pem]
HTTPS_CERT = [put path to HTTPS cert.pem]
HTTPS_CHAIN = [put path to HTTPS chain.pem]
```
5. Run `npm start` in the root directory.


**FYI: You won't need a HTTPS cert if you are running on Windows.  This feature is for testing locally.**
