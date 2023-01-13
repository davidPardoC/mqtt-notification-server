const dotenv = require("dotenv")
dotenv.config()

const private_key_id = process.env.FCM_PRIVATE_KEY_ID
const private_key = JSON.parse(process.env.FCM_PRIVATE_KEY).privateKey;

const config = {private_key, private_key_id}

module.exports = config