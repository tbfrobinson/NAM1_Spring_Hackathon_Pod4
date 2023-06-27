require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./models')

const seedPets = async () => {
    try {
        const pets = [
            {
                _id: 'dddddddddddd',
                category: 'Dog'
            },
            {
                _id: 'cccccccccccc',
                category: 'Cat'
            },
            {
                _id: 'bbbbbbbbbbbb',
                category: 'Bird'
            },
            {
                _id: 'ffffffffffff',
                category: 'Fish'
            },
            {

                _id: 'rrrrrrrrrrrr',
                category: 'Reptile'
            },
            {
                _id: 'oooooooooooo',
                category: 'Other'
            },
        ];

        await db.Pet.insertMany(pets);
        console.log('Created pets!');

    } catch (err) {
        console.log(err);
        process.exit();
    }
}

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
app.use('/posts', require('./controllers/posts.js'))

app.listen(PORT, () => {
    try {
        seedPets();
        console.log(`Server is running on port ${PORT}`)
    }
    catch {
        console.log(`Server Error`)
    }
})