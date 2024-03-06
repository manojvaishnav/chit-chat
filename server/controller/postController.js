const Post = require('../models/postModel')
const User = require('../models/userModel')
const imageUpload = require('../middleware/imageUpload')

// -------------------Create A Post-------------------
module.exports.createPost = async (req, res) => {
    try {
        const { description } = req.body
        const photo = req.files.photo;
        const postedBy = req.user._id

        if (!description || !photo) {
            return res.status(422).json({
                error: "Please fill all the fields :("
            });

        }
        const uploadResult = await imageUpload(photo.tempFilePath)
        const data = new Post({
            description,
            photo: uploadResult,
            postedBy
        })
        const result = await data.save()
        res.status(200).json({ message: "Post Created Successfully", result })
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

// -------------------Read A Post-------------------
module.exports.getPost = async (req, res) => {
    try {
        const { id } = req.params
        const result = await Post.findById({ _id: id }).populate({ path: "postedBy", select: "name userName profile" }).populate({ path: "likes", select: "name userName profile" }).populate({ path: "comments.postedBy", select: "name userName profile" })
        if (!result) {
            return res.status(400).json({ error: 'No Post Found' })
        }
        res.status(200).json({ data: result })
    } catch (error) {
        res.status(400).json({ error: 'Something Went Wrong' })
    }
}

// -------------------Update A Post-------------------
module.exports.updatePost = async (req, res) => {
    try {
        const userId = req.user._id
        const postId = req.params.id
        const result = await Post.findOne({ _id: postId, postedBy: userId })
        if (!result) {
            return res.status(200).json({ message: "No Access To Update" })
        }
        
        const updatedData = {
            description: req.body.description,
        }
        const updatedPost = await Post.findByIdAndUpdate({ _id: result._id }, updatedData, {
            new: true,
            runValidators: true,
        });
        res.status(200).json({ message: "Post Update Successfully", updatedPost })
    } catch (error) {
        res.status(400).json({ error: 'Something Went Wrong', msg: error.message })
    }
}

// -------------------Delete A Post-------------------
module.exports.deletePost = async (req, res) => {
    try {
        const userId = req.user._id
        const postId = req.params.id
        const result = await Post.findOne({ _id: postId, postedBy: userId })
        if (!result) {
            return res.status(200).json({ message: "No Access To Delete" })
        }
        await Post.findByIdAndDelete({ _id: result._id })
        res.status(200).json({ message: "Post Delete Successfully" })

    } catch (error) {
        res.status(400).json({ error: 'Something Went Wrong' })
    }
}

// -------------------Get All Posts-------------------
module.exports.getAllPosts = async (req, res) => {
    try {
        const userId = req.user._id
        const result = await Post.find({ postedBy: { $ne: userId } }).populate({ path: "postedBy", select: "name userName profile" }).populate({ path: "likes", select: "name userName profile" }).populate({ path: "comments.postedBy", select: "name userName profile" }).sort({ createdAt: -1 })
        if (!result) {
            res.status(200).json({ message: 'No Post Found' })
        }
        res.status(200).json({ message: 'Successfully Found', result })
    } catch (error) {
        res.status(400).json({ error: 'Something Went Wrong' })
    }
}

// -------------------Get All Following Posts-------------------
module.exports.getFollowingPost = async (req, res) => {
    try {
        const userId = req.user._id
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        const followingUserIds = user.following.map((followedUser) => followedUser._id);

        const result = await Post.find({ postedBy: { $in: followingUserIds } }).populate({ path: "postedBy", select: "name userName profile" }).populate({ path: "likes", select: "name userName profile" }).populate({ path: "comments.postedBy", select: "name userName profile" }).sort({ createdAt: -1 })

        if (!result) {
            res.status(200).json({ message: 'No Post Found' })
        }
        res.status(200).json({ message: 'Successfully Found', result })
    } catch (error) {
        res.status(400).json({ error: 'Something Went Wrong' })
    }
}

// -------------------Toggle Like Status-------------------
module.exports.toggleLikeStatus = async (req, res) => {
    const userId = req.user._id;
    const postId = req.params.postId;

    try {
        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        const isLike = post.likes.includes(userId);

        if (isLike) {
            // Remove Like
            await Post.findByIdAndUpdate(postId, { $pull: { likes: userId } });
            await User.findByIdAndUpdate(userId, { $pull: { likedPost: postId } });

            res.status(200).json({ message: 'Successfully unlike post' });
        } else {
            // Like Post
            await Post.findByIdAndUpdate(postId, { $push: { likes: userId } });
            await User.findByIdAndUpdate(userId, { $push: { likedPost: postId } });

            res.status(200).json({ message: 'Successfully like post' });
        }
    } catch (error) {
        console.error('Error toggling like status:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

// -------------------Get Likes of A Post-------------------
module.exports.getLikes = async (req, res) => {
    const userId = req.user._id;
    const postId = req.params.postId;

    try {
        const result = await Post.findById(postId, { likes: 1 }).populate({ path: "likes", select: "name userName profile" });
        res.status(201).json({ message: 'Likes Fetch successfully', likes: result });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

// -------------------Post A Comment-------------------
module.exports.postComment = async (req, res) => {
    const userId = req.user._id;
    const postId = req.params.postId;
    const { comment } = req.body;

    try {
        const newComment = {
            comment: comment,
            postedBy: userId,
        };

        const result = await Post.findByIdAndUpdate(postId, { $push: { comments: newComment } }, {
            new: true,
            runValidators: true,
        }).populate({ path: "comments.postedBy", select: "name userName profile" });

        res.status(201).json({ message: 'Comment posted successfully', comment: result });
    } catch (error) {
        console.error('Error posting comment:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

// -------------------Get Comment of A Post-------------------
module.exports.getComment = async (req, res) => {
    const userId = req.user._id;
    const postId = req.params.postId;

    try {

        const result = await Post.findById(postId, { comments: 1 }).populate({ path: "comments.postedBy", select: "name userName profile" });
        res.status(201).json({ message: 'Comments Fetch successfully', comment: result });
    } catch (error) {
        console.error('Error fetching comment:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

// -------------------Delete A Comment-------------------
module.exports.deleteComment = async (req, res) => {
    const userId = req.user._id;
    const postId = req.params.postId;
    const commentId = req.params.commentId;

    try {
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        const comment = post.comments.id(commentId);
        if (!comment) {
            return res.status(404).json({ error: 'Comment not found' });
        }

        if (!comment.postedBy.equals(userId)) {
            return res.status(403).json({ error: 'Unauthorized. User does not own the comment' });
        }

        // Delete the comment
        await Post.findByIdAndUpdate(postId, { $pull: { comments: { _id: commentId } } });

        res.status(200).json({ message: 'Comment deleted successfully' });
    } catch (error) {
        console.error('Error deleting comment:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

// -------------------Update A Comment-------------------
module.exports.updateComment = async (req, res) => {
    const userId = req.user._id;
    const postId = req.params.postId;
    const commentId = req.params.commentId;
    const { comment } = req.body;

    try {
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        const commentData = post.comments.id(commentId);
        if (!commentData) {
            return res.status(404).json({ error: 'Comment not found' });
        }

        if (!commentData.postedBy.equals(userId)) {
            return res.status(403).json({ error: 'Unauthorized. User does not own the comment' });
        }

        // Update the comment text
        commentData.comment = comment;
        await post.save();

        res.status(200).json({ message: 'Comment updated successfully', comment: commentData });
    } catch (error) {
        console.error('Error updating comment:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

// -------------------Get Liked Post-------------------
module.exports.getLikedPost = async (req, res) => {
    const userId = req.user._id;
    try {
        const postData = await User.findById({ _id: userId }, { likedPost: 1 }).populate({ path: 'likedPost', populate: { path: 'postedBy', select: 'name userName profile' }, }).sort({ createdAt: -1 })

        res.status(200).json({ data: postData })

    } catch (error) {
        res.status(500).json({ message: "Internal server error" })
    }
}

// -------------------Toggle To Saved A Post or Not-------------------
module.exports.toggleSavePost = async (req, res) => {
    const userId = req.user._id;
    const postId = req.params.postId;

    try {
        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        const savedPostData = await User.findById(userId, { savedPost: 1 })
        const isSaved = savedPostData.savedPost.includes(postId);

        if (isSaved) {
            // Remove Saved Post
            await User.findByIdAndUpdate(userId, { $pull: { savedPost: postId } });

            res.status(200).json({ message: 'Post Removed From Saved Post' });
        } else {
            // Save a Post
            await User.findByIdAndUpdate(userId, { $push: { savedPost: postId } });

            res.status(200).json({ message: 'Successfully saved post' });
        }
    } catch (error) {
        console.error('Error toggling save status:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

// -------------------Get Saved Post-------------------
module.exports.getSavedPost = async (req, res) => {
    const userId = req.user._id;
    try {
        const postData = await User.findById({ _id: userId }, { savedPost: 1 }).populate({ path: 'savedPost', populate: { path: 'postedBy', select: 'name userName profile' }, }).sort({ createdAt: -1 })

        res.status(200).json({ data: postData })

    } catch (error) {
        res.status(500).json({ message: "Internal server error" })
    }
}