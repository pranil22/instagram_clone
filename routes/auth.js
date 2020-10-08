const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const crypto = require('crypto');

const User = mongoose.model('User');
const bcrypt = require('bcrypt');
const { JWT_SECRET, SEND_GRID_API_KEY } = require('../config/keys');
const jwt = require('jsonwebtoken');
const loginMiddlewre = require('../middleware/requiredLogin');


const nodemailer = require('nodemailer');
const sentGridTransport = require('nodemailer-sendgrid-transport');
const { EMAIL_URL } = require('../config/keys');

const options = {
    auth: {
        api_key: SEND_GRID_API_KEY
    }
}

const mailer = nodemailer.createTransport(sentGridTransport(options));

//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

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

                            const email1 = {
                                to: user.email,
                                from: "instagram.12.official@gmail.com",
                                subject: "Welcome to Instagram",
                                html:`<h3>Welcome to Instagram</h3>
                                    <p>Glad to see you</p>`
                            }

                            mailer.sendMail(email1, (err, res) => {
                                console.log(err);
                                console.log(res);
                                console.log(email1.to);
                            });
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

router.post("/reset-password", (req, res) => {
    
    if(!req.body.email) {
        return res.status(422).json({error: "Enter email address"});
    }

    crypto.randomBytes(32, (err, buffer) => {
        const token = buffer.toString("hex");
        User.findOne({email: req.body.email})
            .then((user) => {
                if(user === null) {
                    return res.status(404).json({error: "User not found with given email"});
                }

                if(user) {
                    user.resetToken = token;
                    user.expireToken = Date.now() + 3600000;

                    user.save()
                        .then((result) => {
                            mailer.sendMail({
                                to: user.email,
                                from: "instagram.12.official@gmail.com",
                                subject: "Reset password",
                                html : `<p>You requested for password change<?p>
                                    <h5>Click this <a href="${EMAIL_URL}/${token}">Link</a> to reset password</h5>
                                `
                            })

                            res.status(200).json({message: "Check your mail"});
                        })
                }
                else {
                    res.status(404).json({error: "User not found"});
                }
            })
    })
});

router.post("/new-password", (req, res) => {
    const { token, password } = req.body;

    User.findOne({resetToken: token, expireToken: { $gt: Date.now()}})
        .then((user) => {
            if(user) {
                bcrypt.hash(password, 12)
                    .then((hashedPassword) => {
                        user.password = hashedPassword;
                        user.resetToken = undefined;
                        user.expireToken = undefined;

                        user.save()
                            .then((result) => {
                                return res.status(200).json({message: "Password updated"})
                            })
                            .catch((err) => {
                                return res.status(500).json({error: "Server Error"})
                            })
                    })
            } else {
                return res.status(404).json({error: "Session expired try again"});
            } 
        })
})


module.exports = router;
