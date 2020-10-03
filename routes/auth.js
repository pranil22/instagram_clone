const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = mongoose.model('User');
const bcrypt = require('bcrypt');
const { JWT_SECRET } = require('../config/keys');
const jwt = require('jsonwebtoken');
const loginMiddlewre = require('../middleware/requiredLogin');

router.post('/signup', (req, res, next) => {
    const { name,email, password, profilePic} = req.body;

    if(!name || !email || !password) {
        return res.status(422).json({
            error: "please add all the fields"
        })
    }

    
    if(email.trim() === "" || password.trim() === "" || name.trim() === "") {
        return res.status(422).json({
            error: 'please fill all the fields'
        })
    }


    User.findOne({email: email})
        .then(user => {

            if(user) {
                return res.status(422).json({
                    error: 'user already exists with gievn email'
                })
            }

            

            bcrypt.hash(password, 12)
                .then(hashedPassword => {
                    const user1 = {
                        name,
                        email,
                        password: hashedPassword
                    };
        
                    if(profilePic) {
                        user1.profilePic = profilePic;
                    }

                    console.log(user1);
                    const newUser = new User(user1);
        

                    newUser
                        .save()
                        .then((user) => {
                            console.log(user);
                            res.status(201).json({
                                message: 'Successfully registered user'
                            })
                        })
                        .catch((err) => {
                            res.status(500).json({
                                error: 'unable to add user somethong went wrong'
                            })
                        })
                })

            
        })
        .catch(err => {
            res.status(500).json({
                error: 'Somthing went wrong'
            })
        })

});

router.post('/signin', (req, res, next) => {
    const { email, password } = req.body;


    if(!email || !password) {
        return res.status(422).json({
            error: 'please fill all the fields'
        })
    }

    if(email.trim() === "" || password.trim() === "") {
        return res.status(422).json({
            error: 'please fill all the fields'
        })
    }

    User.findOne({email: email})
        .then(user => {
            if(!user) {
                return res.status(404).json({
                    error: 'user not exists with given email'
                });
            }

            bcrypt.compare(password, user.password)
                .then(isCorrect => {
                    if(isCorrect) {

                        const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '72h' });

                        const { _id, email, name, followers, followings, profilePic } = user;
                        console.log(user);
                        return res.status(200).json({
                            token, 
                            user: { 
                                _id, 
                                email,
                                name, 
                                followers, 
                                followings, 
                                profilePic 
                            }
                        });
                    }
                    else {
                        return res.status(404).json({
                            message: 'invalid password or email'
                        });
                    }
                })
                .catch(err => {
                    console.log(err);
                    return res.status(500).json({
                        error: 'something went wrong'
                    })
                })
        })
        .catch(err => {
            return res.status(500).json({
                error: 'something went wrong'
            });
        })
})

module.exports = router;
