const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types;

const postSchema = new mongoose.Schema({
    caption: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    likes: [
        { type: ObjectId, ref: 'User'}
    ],
    comments: [{
        comment: { type: String },
        postedBy: {type: ObjectId, ref: 'User'}
    }],
    postedBy: {
        type: ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
});

mongoose.model('Post', postSchema);