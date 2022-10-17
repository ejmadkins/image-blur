// Imports the Google Cloud client library
const { Storage } = require('@google-cloud/storage')
const sharp = require('sharp')
const express = require('express')
const app = express()
const { ref, getDownloadURL } = require('firebase/storage')
const { collection, addDoc, serverTimestamp } = require('firebase/firestore')
const { firebaseStorage, db } = require('../firebase/config')
app.use(express.json())

// Creates a client
const cloudStorage = new Storage()
const pipeline = sharp()

const THUMB_MAX_WIDTH = 200
const THUMB_MAX_HEIGHT = 200

app.post('/', async (req, res) => {
    try {
        const bucketName = req.body.name.slice(
            req.body.name.indexOf('objects/') + 'objects/'.length
        )
        const thumbnailUploadStream = await cloudStorage
            .bucket(req.body.bucket)
            .file(bucketName.replace('source', 'resized'))
            .createWriteStream()
            .on('finish', async () => {
                console.log('file upload complete')
                await getDownloadURL(
                    ref(
                        firebaseStorage,
                        bucketName.replace('source', 'resized')
                    )
                ).then(async (url) => {
                    await addDoc(collection(db, 'gallery'), {
                        image: url,
                        timestamp: serverTimestamp(),
                    })
                    console.log(url)
                })
            })

        await pipeline
            .resize(THUMB_MAX_WIDTH, THUMB_MAX_HEIGHT)
            .pipe(thumbnailUploadStream)

        await cloudStorage
            .bucket(req.body.bucket)
            .file(bucketName)
            .createReadStream()
            .pipe(pipeline)
            .on('finish', () => {
                console.log('file download complete')
            })

        res.send('Image resized successfully')
    } catch (error) {
        res.status(400).send(error.message)
    }
})

module.exports = app
