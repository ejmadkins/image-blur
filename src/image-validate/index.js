const { http } = require ('@google-cloud/functions-framework')
const { Storage } = require('@google-cloud/storage')
const vision = require('@google-cloud/vision')
const express = require('express')

const client = new vision.ImageAnnotatorClient()
const storage = new Storage()
const app = express()

app.use(express.json())

// Creates a client

app.post('/', async (req, res) => {
    // Blurs uploaded images that are flagged as Adult or Violence.
    const file = storage.bucket(req.body.bucket).file(req.body.name)
    const filePath = `gs://${req.body.bucket}/${req.body.name}`

    console.log(`Analyzing ${file.name}.`)

    try {
        const [result] = await client.safeSearchDetection(filePath)
        const detections = result.safeSearchAnnotation || {}

        if (
            detections.adult === 'VERY_LIKELY' ||
            detections.violence === 'VERY_LIKELY'
        ) {
            console.log(`Detected ${file.name} as inappropriate.`)
            res.json({ appropriate: false })
        } else {
            console.log(`Detected ${file.name} as OK.`)
            res.json({ appropriate: true })
        }
    } catch (err) {
        console.error(`Failed to analyze ${file.name}.`, err)
        throw err
    }
})

http('imageValidate', app)