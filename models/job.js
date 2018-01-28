const mongoose = require("mongoose");

// SCHEMA SETUP
let jobSchema = new mongoose.Schema({
    title: String,
    description: String,
    date: {type: Date, default: Date.now},
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
});

// Export
module.exports = mongoose.model("Campground", jobSchema);