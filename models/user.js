const mongoose = require("mongoose");
const passportLocalMongooese = require("passport-local-mongoose");

const UserSchema = new mongoose.Schema({
    username: String,
    password: String
});

UserSchema.plugin(passportLocalMongooese);

module.exports = mongoose.model("User", UserSchema);