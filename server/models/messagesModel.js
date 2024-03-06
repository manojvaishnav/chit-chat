const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema.Types;

const messageSchema = new mongoose.Schema({
    sender: {
        type: ObjectId,
        ref: "USER"
    },
    content: {
        type: String,
        trim: true
    },
    chat: {
        type: ObjectId,
        ref: "CHAT"
    },
}, {
    timestamps: true
}
)

const message = new mongoose.model('MESSAGE', messageSchema)

module.exports = message