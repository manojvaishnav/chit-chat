const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema.Types;

const chatSchema = new mongoose.Schema({
    chatName: {
        type: String,
        trim: true
    },
    users: [{
        type: ObjectId,
        ref: "USER"
    }],
    latestMessage: {
        type: ObjectId,
        ref: "MESSAGE"
    }
}, {
    timestamps: true
}
)

const chat = new mongoose.model('CHAT', chatSchema)

module.exports = chat