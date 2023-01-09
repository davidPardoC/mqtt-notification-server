const express = require("express")
const mqtt = require("mqtt")
const dotenv = require("dotenv")

dotenv.config()
const app = express()
const port = 3000 || process.env.port

let max_temp = 20
let min_temp = 10

let max_hum = 30
let min_hum = 10

const startMqttCLient = () => {
    const url = 'wss://io.adafruit.com'
    const options = {
        clean: true,
        connectTimeout: 4000,
        clientId: '0F6YVCKSE7NEQPTNPJW6RVA55P',
        username: 'shalizxdxd',
        password: process.env.ADAFRUIT_API_KEY,
        reconnectPeriod: 1000
    }

    const client = mqtt.connect(url, options)

    client.on('connect', function () {
        console.log('Connected')
        client.subscribe('shalizxdxd/feeds/humedad', function (err) {
            if (err) {
                console.log(err)
            }
        })

        client.subscribe('shalizxdxd/feeds/temperatura', function (err) {
            if (err) {
                console.log(err)
            }
        })
    })

    client.on('error', (error) => {
        console.log({ error })
    })

    client.on('message', function (topic, message) {
        console.log(topic, message.toString())
    })
}

app.post('/change/max-temp', (req, res) => {
    try {
        const { value } = req.body
        max_temp = value
        res.json({ message: `New Maximun Temperature is ${max_temp}` })
    } catch (error) {
        res.status(500).json(error)
    }

})

app.post('/change/min-temp', (req, res) => {
    try {
        const { value } = req.body
        min_temp = value
        res.json({ message: `New Minimun Temperature is ${min_temp}` })
    } catch (error) {
        res.status(500).json(error)
    }

})

app.post('/change/max-hum', (req, res) => {
    try {
        const { value } = req.body
        vamax_humlue = value
        res.json({ message: `New Maximun Humidity is ${max_hum}` })
    } catch (error) {
        res.status(500).json(error)
    }

})

app.post('/change/min-hum', (req, res) => {
    try {
        const { value } = req.body
        min_hum = value
        res.json({ message: `New Minumun Humidity is ${min_hum}` })
    } catch (error) {
        res.status(500).json(error)
    }

})


app.listen(port, () => {
    console.log(`Server is running in port ${port}`)
    startMqttCLient()
})