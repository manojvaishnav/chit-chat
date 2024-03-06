const express = require('express')
const router = express.Router()
const { requireLogin } = require('../middleware/requireLogin')
const { sendMessage, getAllMessages } = require('../controller/messageController')

router.post('/', requireLogin, sendMessage)
router.get('/:chatId', requireLogin, getAllMessages)

module.exports = router
