const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types;


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email : {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    profilePic: {
        type: String,
        default: "https://res.cloudinary.com/dh8zahoqm/image/upload/v1601638912/no-photo_g4g2o8.jpg"
    },
    followers: [{type: ObjectId, ref: 'User'}],
    followings: [{type: ObjectId, ref:'User'}]
});

mongoose.model('User', userSchema);

