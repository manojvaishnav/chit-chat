const Chat = require('../models/ChatModel')
const User = require('../models/userModel')

module.exports.createChat = async (req, res) => {
    try {
        const user = req.user._id
        const { userId } = req.body

        if (!userId) {
            return res.status(400).json({ message: "Please send a userId" })
        }

        var isChatExists = await Chat.find({
            $and: [
                { users: { $eq: user } },
                { users: { $eq: userId } }
            ]
        }).populate({ path: 'users', select: 'name profile userName' }).populate({ path: 'latestMessage', select: 'sender content' })
        isChatExists = await User.populate(isChatExists, { path: 'latestMessage.sender', select: 'name profile userName' })

        if (isChatExists.length > 0) {
            return res.status(200).json({ messaage: 'Chat Found', chat: isChatExists[0] })
        }

        const newChat = new Chat({
            chatName: "sender",
            users: [user, userId]
        })
        const chat = await newChat.save()
        const fullChat = await Chat.findById(chat).populate({ path: 'users', select: 'name profile userName' })
        res.status(200).json({ message: "Chat created", chat: fullChat })

    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Internal server error" })
    }
}

module.exports.fetchChats = async (req, res) => {
    try {
        const user = req.user._id
        var chats = await Chat.find({ users: { $eq: user } }).populate({ path: 'users', select: 'name userName profile' }).populate({ path: 'latestMessage', select: 'sender content' }).sort({ updatedAt: -1 })

        chats = await User.populate(chats, { path: 'latestMessage.sender', select: 'name profile userName _id' })
        res.status(200).json({ messaage: "All chat are fetched", chat: chats })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Internal server error" })
    }
}