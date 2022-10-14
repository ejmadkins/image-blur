const app = require('./app.js')

const APP_PORT = 3002

app.listen(APP_PORT, () => {
    console.log(`App is listening on port ${APP_PORT}`)
})
