// Imports the Google Cloud client library
const { Storage } = require('@google-cloud/storage')
const sharp = require('sharp')
const express = require('express')
const app = express()
app.use(express.json())

// Creates a client
const storage = new Storage()

const THUMB_MAX_WIDTH = 200
const THUMB_MAX_HEIGHT = 200

app.post('/', async (req, res) => {
    try {
        const thumbnailUploadStream = await storage
            .bucket(`${req.body.bucket}-resized`)
            .file(req.body.name)
            .createWriteStream()
            .on('finish', () => {
                console.log('file upload complete')
            })

        const pipeline = sharp()
        await pipeline
            .blur(2)
            .resize(THUMB_MAX_WIDTH, THUMB_MAX_HEIGHT)
            .pipe(thumbnailUploadStream)

        await storage
            .bucket(req.body.bucket)
            .file(req.body.name)
            .createReadStream()
            .pipe(pipeline)
            .on('finish', () => {
                console.log('file download complete')
            })

        res.send('Image resized and blurred successfuly')
    } catch (error) {
        res.status(400).send(error.message)
    }
})

module.exports = app
