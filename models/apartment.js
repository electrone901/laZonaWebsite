const mongoose = require("mongoose");

let apartmentSchema = new mongoose.Schema({
    name: String,
    image: String,
    image_id: String,
    price: String,
    street: String,
    city: String,
    state: String,
    zipcode: String,
    description: String,
    location: String,
    lat: Number,
    lng: Number,
    note: String,
    createdAt: {type: Date, default: Date.now},
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
<<<<<<< HEAD
    ]
=======
    ],
    ratings: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Rating"
        }
   ],
   flags: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Flag"
      }
   ],
   isFlag: { type: Boolean, default: false }
>>>>>>> addingStyle
});

module.exports = mongoose.model("Apartment", apartmentSchema);