const mongoose = require("mongoose");
const passportLocalMongooese = require("passport-local-mongoose");

const UserSchema = new mongoose.Schema({
    username: String,
    password: String,
    firstName: String,
    lastName: String,
    email: {type: String, unique: true, required: true},
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    avatar: String
});

UserSchema.plugin(passportLocalMongooese);

module.exports = mongoose.model("User", UserSchema);