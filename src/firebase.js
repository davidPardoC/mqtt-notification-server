const admin = require("firebase-admin");
const firebaseConfig = require('../google-credentials.json');
const config = require("./config");

const initializeFirebaseApp = () => {
    const allConfig = { ...firebaseConfig, ...config }
    admin.initializeApp({ credential: admin.credential.cert(allConfig) })
}

const sendNotification = (title = "holi", body = "boli", tokens = []) => {
    console.log('Sending notification')
    if (tokens.length === 0) {
        return
    }
    admin.messaging().sendMulticast({
        tokens, notification: { title, body }
    }).then(res => console.log(res))
}

module.exports = { initializeFirebaseApp, sendNotification }