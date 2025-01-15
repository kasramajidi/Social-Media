const mongoose = require("mongoose")

const schema = new mongoose.Schema({
    user: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true
    },
    token: {
        type: String,
        required: true
    },
    tokenExpireTime: {
        type: Date,
        required: true
    }
})

const ResetPasswordModel = mongoose.model("ResetPassword", schema)

module.exports = ResetPasswordModel;