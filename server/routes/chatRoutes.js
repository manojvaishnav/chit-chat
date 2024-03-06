const express = require('express')
const router = express.Router()
const { requireLogin } = require('../middleware/requireLogin')
const { createChat, fetchChats } = require('../controller/chatController')

router.post('/', requireLogin, createChat)
router.get('/', requireLogin, fetchChats)

module.exports = router
