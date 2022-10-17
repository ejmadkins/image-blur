// Imports the Google Cloud client library
const { Storage } = require('@google-cloud/storage')
const sharp = require('sharp')
const express = require('express')
const app = express()
app.use(express.json())

// Creates a client
const cloudStorage = new Storage()

const THUMB_MAX_WIDTH = 200
const THUMB_MAX_HEIGHT = 200

app.post('/', async (req, res) => {
    try {
        const resourceName = req.body.name.slice(
            req.body.name.indexOf('objects/') + 'objects/'.length
        )

        const dstDirectory = resourceName.replace('source', 'resized')

        console.log(`src file: ${resourceName}`)
        console.log(typeof dstDirectory)
        console.log(`dst file: ${dstDirectory}`)
        console.log(typeof dstDirectory)

        const downloadFile = await cloudStorage
            .bucket(req.body.bucket)
            .file(resourceName)
            .download()

        const resizeFile = await sharp(...downloadFile)
            .blur(10)
            .resize(THUMB_MAX_WIDTH, THUMB_MAX_HEIGHT)
            .toBuffer()

        await cloudStorage
            .bucket(req.body.bucket)
            .file(dstDirectory)
            .save(resizeFile)

        res.json({ name: dstDirectory })
    } catch (error) {
        res.status(400).send(error.message)
    }
})

module.exports = app
