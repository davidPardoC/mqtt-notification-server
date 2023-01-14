const { sendNotification } = require("./firebase")

const handleFeeds = ({ max_temp, min_temp, max_hum, min_hum, topic, messageBuffer, server_notification_enambled, notificationTokens, lastValue }) => {
    if (!server_notification_enambled) {
        return
    }
    const message = messageBuffer.toString()
    lastValue[topic] = message
    if (topic.includes("temperatura")) {
        console.log('temperatura', message)
        if (Number(message) > max_temp) {
            sendNotification("Maxima temperatura alcanzada", `${message}ºC a las ${new Date()}`, notificationTokens)
        } else if (Number(message) < min_temp) {
            sendNotification("Mínima temperatura alcanzada", `${message}ºC a las ${new Date()}`, notificationTokens)
        }
    } else if (topic.includes("humedad")) {
        console.log('humedad', message)
        if (Number(message) > max_hum) {
            sendNotification("Maxima humedad alcanzada", `${message} a las ${new Date()}`, notificationTokens)
        } else if (Number(message) < min_hum) {
            sendNotification("Mínima humedad alcanzada", `${message} a las ${new Date()}`, notificationTokens)
        }
    }
}

module.exports = { handleFeeds }