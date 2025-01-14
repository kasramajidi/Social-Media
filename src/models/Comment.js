const mongoose = require("mongoose")

const schema = new mongoose.Schema({
    post: {
        type: mongoose.Types.ObjectId,
        ref: "Post",
        required: true
    },
    user: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true
    },
    content: {
        type: String,
        required: true
    },
    // parent: {
    //     type: mongoose.Types.ObjectId,
    //     ref: "Comment",
    // }
}, {timestamps: true})


const commentModel = mongoose.model("Comment", schema)

module.exports = commentModel;