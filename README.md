# levelDifference
This webpage was created to display the difference in Hypixel Level between AmKale, DSNS, and jiebi.

This project was created with the Hypixel API, Express, and Ejs.

## 1) Make sure to install the required modules by typing:
`npm install dotenv hypixel-api https express ejs`

## 2) Create a .env file with these properties:
```
API_KEY = [type /api new on mc.hypixel.net to get api key]
RELOAD_TIME = 60000
HTTPS_KEY = [put path to HTTPS privkey.pem]
HTTPS_CERT = [put path to HTTPS cert.pem]
HTTPS_CHAIN = [put path to HTTPS chain.pem]
```

## 3) Create a levels.json file with [] inside

Run the server by typing `node .`
