// Imports the Google Cloud client library
const { Storage } = require('@google-cloud/storage')
const sharp = require('sharp')
const express = require('express')
const app = express()
const Firestore = require('@google-cloud/firestore');
app.use(express.json())

const db = new Firestore({
    projectId: 'ejmadkins-sky-tech-day',
});

const docRef = db.collection('images').doc('images');

// Creates a client
const storage = new Storage()

const THUMB_MAX_WIDTH = 200
const THUMB_MAX_HEIGHT = 200

app.post('/', async (req, res) => {
    try {
        const thumbnailUploadStream = await storage
            .bucket(`ejmadkins-sky-tech-day.appspot.com`)
            .file(req.body.name)
            .createWriteStream()
            .on('finish', () => {
                console.log('file upload complete')
            })

        const pipeline = sharp()
        await pipeline
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

        await docRef.set({
            image: `gs://${req.body.bucket}/${req.body.name}`
        })
        res.send('Image resized successfuly')
    } catch (error) {
        res.status(400).send(error.message)
    }
})

module.exports = app
