// @ts-check
require("dotenv").config();

const HypixelAPIReborn = require("hypixel-api-reborn");
const hypixel = new HypixelAPIReborn.Client(process.env.API_KEY, { cache: true });

module.exports = hypixel;
