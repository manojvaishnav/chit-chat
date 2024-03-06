const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getUserProfile, toggleFollowStatus, postStory, deleteStory, previewStory, getFollowingUserStory, getAllUSerList, getLoginUserStory, editUserProfile, forgotPasswordToken, forgotPassword } = require('../controller/userController')
const { verifyToken } = require('../middleware/verifyToken')
const { requireLogin } = require('../middleware/requireLogin')

// Verify the Token
router.post('/verify', verifyToken)

// Register API
router.post('/signup', registerUser)

// Login API
router.post('/signin', loginUser)

// Forgot Password Token Generate
router.post('/password/forgot-password', forgotPasswordToken)

// Reset  Password
router.post('/password/reset-password', forgotPassword)

// Edit User Profile API
router.put('/', requireLogin, editUserProfile)

// Get User Profile By Username
router.get('/:username', requireLogin, getUserProfile)

//Follow or Unfollow a User
router.post('/togglefollow/:userId', requireLogin, toggleFollowStatus)

//Post A Story
router.post('/story/', requireLogin, postStory)

//Preview A Story
router.get('/story/:storyId', requireLogin, previewStory)

//Delete A Story
router.delete('/story/:storyId', requireLogin, deleteStory)

//Get Login User Story
router.get('/story/login/story', requireLogin, getLoginUserStory)

//get Following user story
router.get('/following/story', requireLogin, getFollowingUserStory)

//Get All User List
router.get('/all/list', requireLogin, getAllUSerList)

module.exports = router