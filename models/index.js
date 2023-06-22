const mongoose = require('mongoose');
require('dotenv').config();

const dbName = 'NAM1_Spring_Pod4_Hackathon_Temp_DB_Name'
const MONGODB_URI = process.env.MONGODB_URI || `mongodb://localhost:27017/${dbName}`

mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})

const db = mongoose.connection

db.once('open', () => {
    console.log(`Connected to MongoDB at ${db.host}:${db.port}`)
})

db.on('error', err => {
    console.error(`Errors \n${err}`)
})

module.exports = {
    User: require('./User'),
};