// @ts-check
require("dotenv").config();

try {
    const HypixelAPIReborn = require("hypixel-api-reborn");
    const hypixel = new HypixelAPIReborn.Client(process.env.API_KEY, { cache: true });

    module.exports = hypixel;
} catch {
    console.log("No API Key")
}

