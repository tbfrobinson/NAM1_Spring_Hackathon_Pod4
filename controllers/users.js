const router = require('express').Router()
const db = require('../models')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

router.get('/', (req, res) => {
    res.json({ msg: 'User Route' })
})

// register route
router.post('/register', async (req, res) => {
    try {
        // check if email already has an account
        const findUserEmail = await db.User.findOne({
            email: req.body.email
        })
        // check if username already has an account
        const findUserUsername = await db.User.findOne({
            username: req.body.username
        })

        // return if either of the above
        if(findUserEmail) return res.status(400).json({ msg: 'Email already tied to an account'})
        if(findUserUsername) return res.status(400).json({ msg: 'Username already tied to an account'})

        // bcrypt up that pword
        const password = req.body.password
        const saltRounds = 12
        const hashedPassword = await bcrypt.hash(password, saltRounds)

        // insert into the database
        const newUser = new db.User({
            username: req.body.username,
            password: hashedPassword,
            email: req.body.email,
        })

        // why did I not use db.User.create()? and use .save instead?
        await newUser.save()

        // the basic user information for the jwt 
        const payload = {
            username: newUser.username,
            id: newUser._id,
            email: newUser.email,
        }

        // if u dont have a JWT_SECRET this will work fine /s
        const token = jwt.sign(payload, process.env.JWT_SECRET)

        // return token with basic user sheet (shit)
        res.json({ token })
    } catch(err) {
        console.log(err)
        res.status(500).json({ msg: 'Server Error' })
    }
})

// users get to get their own profile
router.get('/:id', async (req, res) => {
    try {
        // they are already signed in to get here,
        // so we just grab their id 
        const user = await db.User.findById(req.params.id).populate('posts').populate('comments')
        res.json(user)
    } catch(err) {
        console.log(err)
        res.status(500).json({ msg: 'Server Error' })
    }
})

// route to update user password
router.put('/:id/password', async (req, res) => {
    try {
        // find user, they will be logged in so it just grabs from state
        const user = await db.User.findById(req.params.id)
        const newPassword = req.body.newPassword
        // compare the passwords
        const matchedPasswords = await bcrypt.compare(req.body.password, user.password)
        // if they don't know their pword, reject them
        if (!matchedPasswords) return res.status(400).json({ msg: 'Invalid Credentials' })
        // hash the new password
        const saltRounds = 12
        const hashedPassword = await bcrypt.hash(newPassword, saltRounds)
        // if they try to use the same pword, reject them
        if (req.body.password === req.body.newPassword) return res.status(400).json({ msg: 'New password cannot be the same as old password' })
        user.password = hashedPassword
        // save the new pword
        await user.save()
        res.json({ msg: 'Password Updated' })
        
    } catch(err) {
        console.log(err)
        res.status(500).json({ msg: 'Server Error' })
    }
})

router.put('/:id/email', async (req, res) => {
    try {
        //find user
        const user = await db.User.findById(req.params.id)
        // see if another user has an account with this email
        const checkEmail = await db.User.findOne({ email: req.body.newEmail })
        if (checkEmail) {
            return res.json({ msg: 'Email already in use' })
        }
        // set new email
        user.email = req.body.newEmail
        await user.save()
        res.json({ msg: 'Email Updated' })
    } catch(err) {
        console.log(err)
        res.status(500).json({ msg: 'Server Error' })
    }
})

router.put('/:id/username', async (req, res) => { 
    try {
        const user = await db.User.findById(req.params.id)
        const checkUsername = await db.User.findOne({ username: req.body.newUsername })
        if (checkUsername) return res.status(400).json({ msg: 'Username already taken' })
        user.username = req.body.newUsername
        await user.save()
        res.json({ msg: 'Username Updated' })
    } catch(err) {
        console.log(err)
        res.status(500).json({ msg: 'Server Error' })
    }
})

module.exports = router