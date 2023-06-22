require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors())
app.use(express.json())

const middleware = (req, res, next) => {
    console.log('middleware invoked')
    next()
}

app.get('/', middleware, (req, res) => {
    res.json({ msg: 'Server is working'})
})

app.use('/users', require('./controllers/users.js'))

app.listen(PORT, () => {
    try {
        console.log(`Server is running on port ${PORT}`)
    }
    catch {
        console.log(`Server Error`)
    }
})