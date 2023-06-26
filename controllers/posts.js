const router = require('express').Router()
const db = require('../models')
const multer = require('multer')
const cloudinary = require('cloudinary').v2

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
})

const upload = multer({ dest: 'uploads/' })

router.get('/', async (req, res) => {
    try {
        const posts = await db.Post.find({}).populate('user').populate('pet').sort({ createdAt: 'desc' })   
        res.json(posts)
    } catch(err) {
        console.log(err)
        res.status(500).json({ msg: 'Server Error' })
    }
})

router.post('/', upload.single('image'), async(req, res) => {
    let url = null
    if (req.file) {
        const cloudImageData = await cloudinary.uploader.upload(req.file.path)
        url = cloudImageData.secure_url
    }
    try {
        const petType = await db.Pet.findOne({ category: req.body.petType })
        const newPost = await db.Post.create({
            userId: req.body.userId,
            petId: petType._id,
            title: req.body.title,
            image: url,
            content: req.body.content,
        })
        const findUser = await db.User.findById(req.body.userId)
        findUser.posts.push(newPost._id)
        await findUser.save()
        res.json(newPost)
        res.status(200)
    } catch(err) {
        console.log(err)
        res.status(500).json({ msg: 'Server Error' })
    }
})

router.get('/:id', async (req, res) => {
    try {
        const getPost = await db.Post.findById(req.params.id).populate('userId').populate('petId').populate('comments')
        res.json(getPost)
    } catch(err) {
        console.log(err)
        res.status(500).json({ msg: 'Server Error' })
    }
})

router.post('/:id/comment', async (req, res) => { 
    try {
        const getPost = await db.Post.findById(req.params.id).populate('comments').populate('userId')
        const getUser = await db.User.findById(req.body.userId)
        const newComment = await db.Comment.create({ 
            userId: req.body.userId,
            postId: req.params.id,
            content: req.body.content,
        })
        getPost.comments.push(newComment._id)
        await getPost.save()
        getUser.comments.push(newComment._id)
        await getUser.save()
        res.json(getPost)
    } catch(err) {
        console.log(err)
    }
})


module.exports = router