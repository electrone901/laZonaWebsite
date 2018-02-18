const mongoose = require("mongoose");

let apartmentSchema = new mongoose.Schema({
    name: String,
    image: String,
    price: Number,
    street: String,
    city: String,
    state: String,
    zipcode: Number,
    description: String,
    note: String,
    date: {type: Date, default: Date.now},
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ]
});

module.exports = mongoose.model("Apartment", apartmentSchema);