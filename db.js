const mongoose = require('mongoose')
require('dotenv').config()

// const mongoUrl = 'mongodb://localhost:27017/htl'
const mongoUrl = process.env.MONGODB_URL_LOCAL
// const mongoUrl = process.env.MONGODB_URL
// const mongoUrl = 'mongodb+srv://harshkumar2468chk_db_user:HARSH2468@htl.7r4wklx.mongodb.net/'

mongoose.connect(mongoUrl)

const db = mongoose.connection

db.on('connected' , () => {
    console.log('Mongoose is connected')
})

db.on('error', (err) => {
    console.log('Mongoose connection error', err)
})

db.on('disconnected', () => {
    console.log('Mongoose is disconnected')
})

module.exports = db