const mongoose = require('mongoose')

const PostSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    pet: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Pet'
    },
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
    }],
    title: {
        type: String
    },
    content: {
        type: String
    },
}, {
    timestamps: true
})

module.exports = mongoose.model('Post', PostSchema)