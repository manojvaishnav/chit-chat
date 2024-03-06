const Message = require('../models/messagesModel')
const Chat = require('../models/ChatModel')
const User = require('../models/userModel')

// ------------------------SEND MESSAGE --------------------------------
module.exports.sendMessage = async (req, res) => {
    const user = req.user._id
    try {
        const { content, chatId } = req.body

        if (!content || !chatId) {
            return res.status(400).json({ message: "please send content and chatId" })
        }

        const newMessage = new Message({
            sender: user,
            content: content,
            chat: chatId
        })
        const chatData = await newMessage.save()
        var message = await Message.findById(chatData._id).populate({ path: "sender", select: 'name profile userName' }).populate({
            path: 'chat'
        })
        message = await User.populate(message, { path: 'chat.users', select: 'name profile userName' })

        await Chat.findByIdAndUpdate(chatId, { latestMessage: chatData._id })

        res.status(200).json({ message: 'Message sent', chat: message })

    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Internal server error" })
    }
}


// ------------------------GET ALL MESSAGE OF A CHAT--------------------------------
module.exports.getAllMessages = async (req, res) => {
    const user = req.user._id
    try {
        const { chatId } = req.params
        var messages = await Message.find({ chat: chatId }).populate({ path: 'sender', select: 'name profile userName' }).populate({ path: 'chat' })
        messages = await User.populate(messages, { path: 'chat.users', select: "name userName profile" })
        res.status(200).json({ message: "All message fetched", messages: messages })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Internal server error" })
    }
}