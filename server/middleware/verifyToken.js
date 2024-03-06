const jwt = require('jsonwebtoken');
const jwt_secret_key = process.env.JWT_SECRET_KEY
const User = require('../models/userModel')

module.exports.verifyToken = async (req, res) => {
    try {
        const { token } = req.body;
        jwt.verify(token, jwt_secret_key, async (err, payload) => {
            if (err) {
                return res.status(401).json({ error: "You must have logged in" })
            }
            const { _id } = payload
            const user = await User.findById(_id, { password: 0 })
            res.status(200).json({ success: true, user: user })
        })
    } catch (error) {
        res.status(500).json({ message: "Internal server error" })
    }
}