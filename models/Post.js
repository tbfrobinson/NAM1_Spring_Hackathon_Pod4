const mongoose = require('mongoose')

const PostSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    petId: {
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
    image: {
        type: String
    },
    content: {
        type: String
    },
}, {
    timestamps: true
})

module.exports = mongoose.model('Post', PostSchema)