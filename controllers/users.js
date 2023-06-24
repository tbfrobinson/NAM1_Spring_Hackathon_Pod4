const router = require('express').Router()
const db = require('../models')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

router.get('/', (req, res) => {
    res.json({ msg: 'User Route' })
})

router.post('/register', async (req, res) => {
    try {
        const findUserEmail = await db.User.findOne({
            email: req.body.email
        })
        const findUserUsername = await db.User.findOne({
            username: req.body.username
        })

        if(findUserEmail) return res.status(400).json({ msg: 'Email already tied to an account'})
        if(findUserUsername) return res.status(400).json({ msg: 'Username already tied to an account'})

        const password = req.body.password
        const saltRounds = 12
        const hashedPassword = await bcrypt.hash(password, saltRounds)

        const newUser = new db.User({
            username: req.body.username,
            password: hashedPassword,
            email: req.body.email,
        })

        await newUser.save()

        const payload = {
            username: newUser.username,
            id: newUser._id,
            email: newUser.email,
        }

        const token = jwt.sign(payload, process.env.JWT_SECRET)

        res.json({ token })
    } catch(err) {
        console.log(err)
        res.status(500).json({ msg: 'Server Error' })
    }
})

module.exports = router