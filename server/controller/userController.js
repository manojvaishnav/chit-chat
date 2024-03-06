const User = require('../models/userModel')
const Post = require('../models/postModel')
const Story = require('../models/storyModel')
const jwt = require('jsonwebtoken');
const jwt_secret_key = process.env.JWT_SECRET_KEY
const imageUpload = require('../middleware/imageUpload')
const { generateToken } = require('../middleware/generateToken')
const { sendMail } = require('../middleware/mailService')

// -------------------Register A User-------------------
module.exports.registerUser = async (req, res) => {
    try {
        const { name, userName, email, password, } = req.body;
        const profile = req.files.profile;

        if (!name || !userName || !email || !password) {
            return res.status(422).json({
                error: "Please fill all the fields :("
            });
        }
        const isUserEmailExists = await User.findOne({ email });
        if (isUserEmailExists) {
            return res.status(422).json({
                error: "Email Already Exists"
            })
        }
        const isUserNameExists = await User.findOne({ userName });
        if (isUserNameExists) {
            return res.status(422).json({
                error: "Username Already Exists"
            })
        }
        const uploadResult = await imageUpload(profile.tempFilePath)
        const data = new User({
            name,
            userName,
            email,
            password,
            profile: uploadResult
        });

        const result = await data.save()
        const token = jwt.sign({ _id: result._id }, jwt_secret_key)
        res.status(200).json({ token, user: { _id: result._id, name: result.name, userName: result.userName, email: result.email, profile: result.profile } });

    } catch (error) {
        res.status(500).json({ message: "Internal server error" })
    }
}

// -------------------Login A User-------------------
module.exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(422).json({
                error: "Please fill all the fields :("
            });
        }
        const isUserExists = await User.findOne({ email });
        if (isUserExists && (await isUserExists.matchPassword(password))) {
            const token = jwt.sign({ _id: isUserExists._id }, jwt_secret_key)
            const { _id, name, userName, email, profile } = isUserExists;
            res.status(200).json({ token, user: { _id, name, userName, email, profile } });
        } else {
            res.status(400).json({ error: "Email and password are invalid" });
        }
    } catch (error) {
        res.status(500).json({ message: "Internal server error" })
    }
}

// -------------------Forgot Password Token Generate-------------------
module.exports.forgotPasswordToken = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ error: 'Email is required.' });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        }

        const resetToken = generateToken();
        const resetTokenExpiration = Date.now() + 3600000;

        await User.findByIdAndUpdate(user._id, { resetToken, resetTokenExpiration })

        const resetLink = `http://localhost:5000/reset-password?token=${resetToken}`;
        const emailText = `Click the following link to reset your password: ${resetLink}`;
        await sendMail(email, 'Password Reset', emailText);

        res.json({ success: true, message: 'Password reset link sent to your email.' });
    } catch (error) {
        console.error('Error sending reset password email:', error);
        res.status(500).json({ error: 'Internal server error.' });
    }
}

// -------------------Forgot Password-------------------
module.exports.forgotPassword = async (req, res) => {
    try {
        const { token, newPassword } = req.body;

        if (!token || !newPassword) {
            return res.status(400).json({ error: 'Token and newPassword are required.' });
        }

        const user = await User.findOne({
            resetToken: token,
            resetTokenExpiration: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(401).json({ error: 'Invalid or expired reset token.' });
        }

        user.password = newPassword;
        user.resetToken = undefined;
        user.resetTokenExpiration = undefined;
        await user.save();

        res.json({ success: true, message: 'Password reset successful.' });

    } catch (error) {
        console.error('Error resetting password:', error);
        res.status(500).json({ error: 'Internal server error.' });
    }
}

// -------------------Edit User Profile-------------------
module.exports.editUserProfile = async (req, res) => {
    const userId = req.user._id
    try {
        const user = await User.findById(userId, { password: 0 });

        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        }

        const updateObject = {};

        if (req.body.name) {
            updateObject.name = req.body.name;
        }

        if (req.body.email) {
            updateObject.email = req.body.email;
        }

        if (req.files) {
            updateObject.profile = await imageUpload(req.files.profile.tempFilePath)
        }

        await User.findByIdAndUpdate(userId, updateObject, { new: true });

        const userDetail = await User.findById(userId, { password: 0 });
        res.json({ success: true, user: userDetail });
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Internal server error" })
    }
}

// -------------------User Profile-------------------
module.exports.getUserProfile = async (req, res) => {
    try {
        const userName = req.params.username
        const result = await User.findOne({ userName: userName }, { password: 0 }).populate({ path: "followers", select: "name userName profile" }).populate({ path: "following", select: "name userName profile" })
        if (!result) {
            return res.status(400).json({ message: "No Profile Found" })
        }
        else {
            const posts = await Post.find({ postedBy: result._id }).populate({ path: 'postedBy', select: 'name userName profile' }).sort({ createdAt: -1 })
            res.status(200).json({ message: "Profile Fetch Successfully", user: result, post: posts })
        }
    } catch (error) {
        res.status(400).json({ error: "Something Went Wrong" });
    }
}

// -------------------Get All User -------------------
module.exports.getAllUSerList = async (req, res) => {
    try {
        const userId = req.user._id
        const result = await User.find({ _id: { $ne: userId } }, { name: 1, userName: 1, profile: 1 })
        if (!result) {
            return res.status(400).json({ message: "No Profile Found" })
        }
        else {
            res.status(200).json({ message: "All User Fetched Successfully", user: result })
        }
    } catch (error) {
        res.status(400).json({ error: "Something Went Wrong" });
    }
}

// -------------------Toggle Follow Status-------------------
module.exports.toggleFollowStatus = async (req, res) => {
    const followerId = req.user._id;
    const userIdToToggle = req.params.userId;

    try {
        const userToToggle = await User.findById(userIdToToggle);

        if (!userToToggle) {
            return res.status(404).json({ error: 'User not found' });
        }

        const isFollowing = userToToggle.followers.includes(followerId);

        if (isFollowing) {
            // Unfollow
            await User.findByIdAndUpdate(userIdToToggle, { $pull: { followers: followerId } });
            await User.findByIdAndUpdate(followerId, { $pull: { following: userIdToToggle } });

            res.status(200).json({ message: 'Successfully unfollowed user' });
        } else {
            // Follow
            await User.findByIdAndUpdate(userIdToToggle, { $push: { followers: followerId } });
            await User.findByIdAndUpdate(followerId, { $push: { following: userIdToToggle } });

            res.status(200).json({ message: 'Successfully followed user' });
        }
    } catch (error) {
        console.error('Error toggling follow status:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

// -------------------Post A Story-------------------
module.exports.postStory = async (req, res) => {
    const { storyText, textFont, expire } = req.body;
    const userId = req.user._id;

    try {
        const expireTime = new Date();
        expireTime.setDate(expireTime.getDate() + parseInt(expire));

        const newStory = await Story.create({
            storyText,
            postedBy: userId,
            expireTime,
            textFont,
        });

        await User.findByIdAndUpdate(userId, { story: newStory._id });

        const deletionTimeout = expireTime.getTime() - Date.now();
        setTimeout(async () => {
            await Story.findByIdAndDelete(newStory._id);
            await User.findByIdAndUpdate(userId, { story: null });
        }, deletionTimeout);

        res.status(201).json({ message: 'Status posted successfully', story: newStory });
    } catch (error) {
        console.error('Error posting status:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

// -------------------View A Story-------------------
module.exports.previewStory = async (req, res) => {
    const storyId = req.params.storyId;
    try {
        const story = await Story.findById(storyId);
        if (!story) {
            return res.status(404).json({ error: 'Story not found' });
        }

        res.status(200).json({ message: 'Story Fetch successfully', data: story });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

// -------------------Delete A Story-------------------
module.exports.deleteStory = async (req, res) => {
    const userId = req.user._id;
    const storyId = req.params.storyId;
    try {

        const story = await Story.findById(storyId);
        if (!story) {
            return res.status(404).json({ error: 'Story not found' });
        }

        if (!story.postedBy.equals(userId)) {
            return res.status(403).json({ error: 'Unauthorized. User does not own the story' });
        }

        await Story.findByIdAndDelete(storyId);

        await User.findByIdAndUpdate(userId, { story: null });

        res.status(200).json({ message: 'Story deleted successfully' });
    } catch (error) {
        console.error('Error deleting story:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

// -------------------Get Login User Story-------------------
module.exports.getLoginUserStory = async (req, res) => {
    try {
        const userId = req.user._id
        const story = await User.findById(userId, { userName: 1, profile: 1, story: 1, name: 1 })
        if (!story) {
            return res.status(404).json({ error: 'Story not found' });
        }

        res.status(200).json({ message: 'Story Fetch successfully', data: story });
    } catch (error) {
        res.status(500).json({ error: error });
    }
}

// -------------------Get Following User Story-------------------
module.exports.getFollowingUserStory = async (req, res) => {
    const userId = req.user._id
    try {
        const followingUsers = await User.findById(userId, { following: 1 }).populate({ path: 'following', select: 'name userName profile story' })
        if (!followingUsers) {
            return res.status(404).json({ error: 'No Following User found' });
        }
        const stories = followingUsers.following
            .filter(user => user.story !== null && user.story !== undefined)
            .map(user => ({
                userName: user.userName,
                profile: user.profile,
                story: user.story,
                name: user.name
            }))
        res.status(200).json({ message: 'Following user stories fetched', data: stories });
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Internal Server Error' });
    }
}