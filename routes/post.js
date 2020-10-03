const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const requiredLogin = require('../middleware/requiredLogin');
const loginMiddleware = require('../middleware/requiredLogin');
const Post = mongoose.model('Post');

router.get('/allposts', requiredLogin, (req, res) => {
    Post.find()
        .sort({'createdAt': -1})
        .populate('postedBy', "_id name profilePic")
        .populate("comments.postedBy", "_id name")
        .then(posts => {
            return res.status(200).json(posts);
        })
});

router.get('/myfollowingposts', requiredLogin, (req, res) => {
    Post.find({ postedBy: { $in: req.user.followings }})
        .sort({'createdAt': -1})
        .populate("postedBy", "_id name profilePic")
        .populate("comments.postedBy", "_id name")
        .then((posts) => {
            return res.status(200).json(posts);
        })
        .catch((err) => {
            return res.status(200).json({error: err});
        })
});

router.post('/createpost', requiredLogin, (req, res) => {
    const { caption, pic } = req.body;
    
    if(!caption || !pic) {
        return res.status(422).json({
            error: 'fill all the fields'
        });
    }

    if(caption.trim() === "" || pic.trim() === "") {
        return res.status(422).json({
            error: 'fill all the fields'
        });
    }
    
    req.user.password = undefined;

    const newPost = new Post({
        caption,
        image: pic,
        postedBy: req.user
    });

    newPost.save()
        .then(post => {
            res.status(201).json({
                post
            });
        })
        .catch(err => {
            res.status(500).json({
                error: 'something went wrong'
            })
        })
});


router.get('/myposts', requiredLogin, (req, res) => {
    const _id = req.user._id;
    
    Post.find({ postedBy: _id })
        .sort({'createdAt': -1})
        .populate('postedBy', '_id name')
        .then(posts => {
            return res.status(200).json(posts);
        })
        .catch(err => {
            return res.status(500).json({
                error: 'server error'
            })
        })
    
});

router.put("/like", requiredLogin, (req, res) => {
    
    Post.findById(req.body.postId)
        .exec()
        .then((post) => {
            console.log(post);
            if(post != null) {
                console.log(req.user._id);
                post.likes.push(req.user._id);
            
                post.save()
                    .then((post) => {
                        Post.findById(post._id)
                            .populate("postedBy", "_id name profilePic")
                            .then((post) => {
                                return res.status(200).json(post);
                            })
                            .catch((err) => {
                                return res.status(422).json({error: err})
                            })
                    })
            }
            else {
                return res.status(404).json({error: "Not found"});
            }
        })
        .catch((err) => {
            console.log(err);
        })

})

router.put("/unlike", requiredLogin, (req, res) => {
    Post.findByIdAndUpdate(req.body.postId, {
      $pull: {likes: req.user._id}  
    }, {
        new: true
    })
    .exec((err, result) => {
        if(err) {
            return res.status(422).json({error: err});
        }
        else {
            return res.status(200).json(result);
        }
    })
})


router.put("/comment", requiredLogin, (req, res) => {

    console.log(req.body);

    const comment = {
        comment: req.body.comment,
        postedBy: req.user._id
    }

    Post.findByIdAndUpdate(req.body.postId, {
      $push: {comments: comment}  
    }, {
        new: true
    })
    .populate("postedBy", "_id name profilePic")
    .populate("comments.postedBy", "_id name")
    .exec((err, result) => {
        if(err) {
            return res.status(422).json({error: err});
        }
        else {
            console.log(result);
            return res.status(200).json(result);
        }
    })
})


router.delete("/deletepost/:postId", requiredLogin, (req, res) => {

    Post.findOne({_id: req.params.postId})
        .populate("postedBy", "_id")
        .exec((err, post) => {
            if(err || !post) {
                return res.status(422).json({error: err})
            }
            else if(post.postedBy._id.toString() === req.user._id.toString()) {
                console.log("YES");
                post.remove()
                    .then((result) => {
                        return res.status(200).json({message: "Successfully deleted post"});
                    })
                    .catch((err) => {
                        console.log(err);
                    })
            }
            else {
                return res.status(401).json({error: "you are not allow to delete the post"});
            }
        })

})


module.exports = router;