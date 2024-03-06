const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types;
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true,
        trim:true
    },
    userName: {
        type: String,
        required: true,
        trim:true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    profile: {
        type: String,
        default: 'https://w7.pngwing.com/pngs/340/946/png-transparent-avatar-user-computer-icons-software-developer-avatar-child-face-heroes.png'
    },
    followers: [
        {
            type: ObjectId,
            ref: "USER"
        }
    ],
    following: [
        {
            type: ObjectId,
            ref: "USER"
        }
    ],
    likedPost: [
        {
            type: ObjectId,
            ref: "POST"
        }
    ],
    savedPost: [
        {
            type: ObjectId,
            ref: "POST"
        }
    ],
    story:
    {
        type: ObjectId,
        ref: "STORY",
        default: null
    },
    resetToken: {
        type: String
    },
    resetTokenExpiration: {
        type: Date
    }
});

// Hash the password
userSchema.pre("save", async function () {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Compare the password
userSchema.methods.matchPassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

const user = new mongoose.model("USER", userSchema);

module.exports = user;