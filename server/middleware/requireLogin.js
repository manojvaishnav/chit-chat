const jwt = require('jsonwebtoken');
const jwt_secret_key = process.env.JWT_SECRET_KEY
const mongoose = require('mongoose');
const User = require('../models/userModel')

module.exports.requireLogin = async (req, res, next) => {
    try {
        const { authorization } = req.headers;
        if (!authorization) {
            return res.status(401).json({ error: "You must have logged in" })
        }
        const token = authorization.replace("Bearer ", "")
        jwt.verify(token, jwt_secret_key, async (err, payload) => {
            if (err) {
                return res.status(401).json({ error: "You must have logged in" })
            }
            const { _id } = payload
            await User.findById(_id).then(userData => {
                req.user = userData
                next()
            })
        })
    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
}
