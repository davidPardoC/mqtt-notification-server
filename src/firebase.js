const admin = require("firebase-admin");
const config = require('../mqtt-notify-45edd-0d820a34d0c7.json')

const initializeFirebaseApp = () => {
    admin.initializeApp({ credential: admin.credential.cert(config) })
}

const sendNotification = (title = "holi", body = "boli", tokens = []) => {
    if(tokens.length === 0){
        return
    }
    admin.messaging().sendMulticast({
        tokens, notification: { title, body }
    }).then(res => console.log(res))
}

module.exports = { initializeFirebaseApp, sendNotification }