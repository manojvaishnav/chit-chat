const express = require('express');
const router = express.Router();
const { requireLogin } = require('../middleware/requireLogin');
const { createPost, updatePost, deletePost, getPost, getAllPosts, toggleLikeStatus, postComment, deleteComment, updateComment, getFollowingPost, getLikedPost, getSavedPost, postSavePost, toggleSavePost, getComment, getLikes } = require('../controller/postController');

// Create A Post
router.post('/post/', requireLogin, createPost)

// Read A Post
router.get('/post/:id', requireLogin, getPost)

// Update A Post
router.put('/post/:id', requireLogin, updatePost)

// Delete A Post
router.delete('/post/:id', requireLogin, deletePost)

// Get All Posts
router.get('/posts/', requireLogin, getAllPosts)

// Get Following Users Posts
router.get('/followingposts/', requireLogin, getFollowingPost)

// Get Liked Posts
router.get('/posts/liked/', requireLogin, getLikedPost)

//Toggle To Save A Post or Not
router.post('/posts/saved/:postId', requireLogin, toggleSavePost)

// Get Saved Posts
router.get('/posts/saved/', requireLogin, getSavedPost)

//Like or Unlike Post
router.post('/post/togglelike/:postId', requireLogin, toggleLikeStatus)

//Get Likes of A Post
router.get('/post/likes/:postId', requireLogin, getLikes)

//Post A Comment
router.post('/post/comment/:postId', requireLogin, postComment)

//Get Comment of A Post
router.get('/post/comment/:postId', requireLogin, getComment)

//Delete A Comment
router.delete('/post/comment/:postId/:commentId', requireLogin, deleteComment)

//Update A Comment
router.put('/post/comment/:postId/:commentId', requireLogin, updateComment)

module.exports = router