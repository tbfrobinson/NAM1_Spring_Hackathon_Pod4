const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post'
    },
    content: {
        type: String
    },
    name: {
        type: String
    },
}, {
    timestamps: true
})

module.exports = mongoose.model('Comment', CommentSchema)