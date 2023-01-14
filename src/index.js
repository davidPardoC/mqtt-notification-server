const express = require("express")
const mqtt = require("mqtt")
const dotenv = require("dotenv")
const { json } = require("express")
const { initializeFirebaseApp, sendNotification } = require("./firebase")
const { handleFeeds } = require("./handlers")

dotenv.config()

const app = express()
const port = process.env.PORT || 3000

let max_temp = 40
let min_temp = 35

let max_hum = 40
let min_hum = 10

let server_notification_enambled = true

const notificationTokens = []

initializeFirebaseApp()

const startMqttCLient = () => {
    const url = 'wss://io.adafruit.com'
    const options = {
        clean: true,
        connectTimeout: 4000,
        clientId: '0F6YVCKSE7NEQPTNPJW6RVA55P',
        username: process.env.ADAFRUIT_USERNAME,
        password: process.env.ADAFRUIT_API_KEY,
        reconnectPeriod: 1000
    }


    if (!options.password) {
        return
    }
    const client = mqtt.connect(url, options)

    client.on('connect', function () {
        console.log('Connected')
        client.subscribe(`${process.env.ADAFRUIT_USERNAME}/feeds/humedad`, function (err) {
            if (err) {
                console.log(err)
            }
        })

        client.subscribe(`${process.env.ADAFRUIT_USERNAME}/feeds/temperatura`, function (err) {
            if (err) {
                console.log(err)
            }
        })
    })

    client.on('error', (error) => {
        console.log('There was an error?')
        console.log({ error })
    })

    client.on('message', function (topic, messageBuffer) {
        console.log(messageBuffer.toString())
        handleFeeds({ max_hum, max_temp, messageBuffer, min_hum, min_temp, topic, notificationTokens })
    })
}
app.use(json())


app.post('/config', (req, res) => {
    try {
        const { maxTemp, minTemp, maxHum, minHum, serverNotificationEnabled } = req.body
        max_temp = maxTemp || max_temp;
        min_temp = minTemp || min_temp;
        max_hum = maxHum || max_hum;
        min_hum = minHum || min_hum;
        server_notification_enambled = serverNotificationEnabled || server_notification_enambled
        res.json({ max_temp, min_temp, max_hum, min_hum, server_notification_enambled })
    } catch (error) {
        res.status(500).json(error)
    }

})

app.get('/config', (req, res) => {
    res.json({ max_temp, min_temp, max_hum, min_hum, server_notification_enambled })
})

app.post('/test/notification', (req, res) => {
    sendNotification('Temperatura Maxima Alcanzada', `25ºC a las ${new Date}`, notificationTokens)
    res.json({ message: "humm" })
})

app.post('/register/notification/token', (req, res) => {
    const { token } = req.body
    if (!token) {
        return res.status(400).send("Invalid token")
    }
    if(notificationTokens.indexOf(token) < 0){
        notificationTokens.push(token)
    }
    res.send("Added token successfully")
})


app.listen(port, () => {
    console.log(`Server is running in port ${port}`)
    startMqttCLient()
})