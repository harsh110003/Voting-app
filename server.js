const express = require('express')
const app = express()
const bodyparser = require('body-parser')
app.use(bodyparser.json())
const db = require('./db')
require('dotenv').config()


//import routes
const userRoutes = require('./routes/userRoutes')
const candidateRoutes = require('./routes/candidateRoutes')
app.use('/user', userRoutes)
app.use('/candidate', candidateRoutes)


const port = process.env.PORT || 3000

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})