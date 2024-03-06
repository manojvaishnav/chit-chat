const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types;

const storySchema = new mongoose.Schema({
    storyText: {
        type: String,
        required: true,
        trim:true
    },
    postedBy: {
        type: ObjectId,
        ref: "USER"
    },
    expireTime: {
        type: Date,
        required: true
    },
    textFont: {
        type: String,
        required: true
    }
}, { timestamps: true });

const story = new mongoose.model('STORY', storySchema)

module.exports = story
