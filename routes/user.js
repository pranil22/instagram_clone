const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const requiredLogin = require('../middleware/requiredLogin');
const Post = mongoose.model('Post');
const User = mongoose.model('User');

router.get('/user/:id', (req, res) => {
    User.findOne({_id: req.params.id})
        .select("-password")
        .then((user) => {
            if(user) {
                Post.find({postedBy: req.params.id})
                    .populate("postedBy", "_id name")
                    .exec((err, posts) => {
                        if(err || !posts) {
                            return res.status(422).json({error: "Something went wrong"});
                        }
                        return res.status(200).json({user, posts});
                    })
            }
            else {
                return res.status(404).json({error: "User not found"});
            }
        })
        .catch((err) => {
            return res.status(500).json({error: "Internal server error"});
        })
});

router.post("/follow", requiredLogin, (req, res) => {
    User.findByIdAndUpdate(req.body.followId, {
        $push: { followers: req.user._id }
    }, {
        new: true
    }, (err, result) => {
        if(err || !result) {
            return res.status(422).json({error: err});
        }
        User.findByIdAndUpdate(req.user._id, {
            $push: { followings: req.body.followId }
        }, {
            new: true
        })
        .select("-password")
        .then((result1) => {
            return res.status(200).json(result1);
        })
        .catch((err) => {
            return res.status(500).json(err);
        })
    })
});

router.post("/unfollow", requiredLogin, (req, res) => {
    User.findByIdAndUpdate(req.body.followId, {
        $pull: { followers: req.user._id }
    }, {
        new: true
    }, (err, result) => {
        if(err || !result) {
            return res.status(422).json({error: err});
        }
        User.findByIdAndUpdate(req.user._id, {
            $pull: { followings: req.body.followId }
        }, {
            new: true
        })
        .select("-password")
        .then((result) => {
            return res.status(200).json(result);
        })
        .catch((err) => {
            return res.status(500).json(err);
        })
    })
});

router.get("/myfollowers", requiredLogin, (req, res) => {
    User.findById(req.user._id)
        .exec()
        .then((user) => {
            User.find({_id: { $in: user.followers }})
                .exec()
                .then((users) => {
                    return res.status(200).json(users);
                })
                .catch((err) => {
                    return res.status(422).json({error: err});
                })
        })
        .catch((err) => {
            return res.status(422).json({error: err});
        })
});


router.get("/myfollowings", requiredLogin, (req, res) => {
    User.findById(req.user._id)
        .exec()
        .then((user) => {
            User.find({_id: { $in: user.followings }})
                .exec()
                .then((users) => {
                    return res.status(200).json(users);
                })
                .catch((err) => {
                    return res.status(422).json({error: err});
                })
        })
        .catch((err) => {
            return res.status(422).json({error: err});
        })
});

router.get("/followers/:userId", requiredLogin, (req, res) => {
    User.findById(req.params.userId)
        .exec()
        .then((user) => {
            User.find({_id: { $in: user.followers }})
                .exec()
                .then((users) => {
                    return res.status(200).json(users);
                })
                .catch((err) => {
                    return res.status(422).json({error: err});
                })
        })
        .catch((err) => {
            return res.status(422).json({error: err});
        })
});


router.get("/followings/:userId", requiredLogin, (req, res) => {
    User.findById(req.params.userId)
        .exec()
        .then((user) => {
            User.find({_id: { $in: user.followings }})
                .exec()
                .then((users) => {
                    return res.status(200).json(users);
                })
                .catch((err) => {
                    return res.status(422).json({error: err});
                })
        })
        .catch((err) => {
            return res.status(422).json({error: err});
        })
});

router.put("/updateProfile/:userId", (req, res) => {
    User.findByIdAndUpdate(
        req.params.userId, 
        { $set: { profilePic: req.body.profilePic }}, 
        { new: true }
    ).exec()
    .then((user) => {
        return res.status(200).json(user);
    })
    .catch((err) => {
        return res.status(404).json({error: "Not found"})
    })
});

module.exports = router;


