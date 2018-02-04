const mongoose = require("mongoose");
const passportLocalMongooese = require("passport-local-mongoose");

const UserSchema = new mongoose.Schema({
    username: String,
    password: String,
    firstName: String,
    lastName: String,
    email: String
});

UserSchema.plugin(passportLocalMongooese);

module.exports = mongoose.model("User", UserSchema);