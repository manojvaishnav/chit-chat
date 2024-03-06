const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require('dotenv').config()
require('./database/conn')
const bodyParser = require('body-parser')
const fileUpload = require('express-fileupload');
const userRoutes = require('./routes/userRoutes')
const postRoutes = require('./routes/postroutes')
const chatRoutes = require('./routes/chatRoutes')
const messageRoutes = require('./routes/messageRoutes');
const path = require('path')

// ------------------------- VARIABLES -------------------------
const port = process.env.PORT || 4000;
const app = express();

// ------------------------- MIDDLEWARE -------------------------
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileUpload({
    useTempFiles: true
}))

// ------------------------- MODELS -------------------------
require("./models/userModel");
require("./models/postModel");
require("./models/ChatModel");
require("./models/messagesModel");

// ------------------------- ROUTES -------------------------
app.use('/api/v1/user', userRoutes);
app.use('/api/v1', postRoutes);
app.use('/api/v1/chat', chatRoutes);
app.use('/api/v1/message', messageRoutes);


const server = app.listen(port, () => {
    console.log(`Server Started at port ${port}`)
})

const io = require('socket.io')(server, {
    pingTimeout: 60000,
    cors: {}
})

io.on('connection', (socket) => {
    socket.on('setup', (userId) => {
        socket.join((userId))
        socket.emit('connected')
    })

    socket.on('join chat', (chatId) => {
        socket.join(chatId)
        socket.emit('Chat connected')
    })

    socket.on('new message', (newMessageReceved) => {
        var chat = newMessageReceved.chat

        if (!chat.chat.users) return console.log("chat.users not defined")

        chat.chat.users.forEach((user) => {
            if (user._id == newMessageReceved.chat.sender._id) return
            socket.in(user._id).emit("message received", newMessageReceved)
        });

    })
})

// Static Files
app.use(express.static(path.join(__dirname, "../client/build")));
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../client/build/index.html"));
});