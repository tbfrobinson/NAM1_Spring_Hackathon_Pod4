const router = require('express').Router()
const db = require('../models')

router.get('/', async (req, res) => {
    try {
        const posts = await db.Post.find({}).populate('user').populate('pet').sort({ createdAt: 'desc' })   
        res.json(posts)
    } catch(err) {
        console.log(err)
        res.status(500).json({ msg: 'Server Error' })
    }
})

router.post('/', async(req, res) => {
    try {
        const petType = await db.Pet.findOne({ category: req.body.petType })
        const newPost = await db.Post.create({
            user: req.body.user,
            pet: petType._id,
            title: req.body.title,
            content: req.body.content,
        })
        const findUser = await db.User.findById(req.body.user)
        findUser.posts.push(newPost._id)
        await findUser.save()
        res.json(newPost)
    } catch(err) {
        console.log(err)
        res.status(500).json({ msg: 'Server Error' })
    }
})

module.exports = router