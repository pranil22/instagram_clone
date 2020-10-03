const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/keys');
const User = mongoose.model('User');

module.exports = (req, res, next) => {
    const { authorization } = req.headers;

    if(!authorization) {
        return res.status(401).json({
            error: 'you must be logged in'
        })
    }

    const arr = authorization.split(" ");
    console.log(arr[1]);
    token = arr[1];

    jwt.verify(token, JWT_SECRET, (err, payload) => {
        
        if(err) {
            return res.status(500).json({
                error: 'you must logged in'
            });
        }


        if(!payload) {
            return res.status(401).json({
                error: 'you must logged in'
            })
        }
        else {
            const { _id } = payload;

            User.findById(_id)
                .then((user) => {
                    req.user = user;
                    next();
                })
                .catch(err => {
                    return res.status(500).json({
                        error: 'server error'
                    });
                })
        }
    })


}