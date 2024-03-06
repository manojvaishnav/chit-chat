const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types;

const postSchema = new mongoose.Schema({
    description: {
        type: String,
        required: true,
        trim:true
    },
    photo: {
        type: String,
        required: true
    },
    postedBy: {
        type: ObjectId,
        ref: "USER"
    },
    likes: [{
        type: ObjectId,
        ref: "USER"
    }],
    comments: [{
        comment: {
            type: String,
            trim:true
        },
        postedBy: {
            type: ObjectId,
            ref: "USER"
        }
    }]

}, { timestamps: true });

const post = new mongoose.model('POST', postSchema)

module.exports = post
