const router = require('express').Router()
const db = require('../models')


router.get('/', (req, res) => {
    res.json({ msg: 'User Route' })
})

module.exports = router