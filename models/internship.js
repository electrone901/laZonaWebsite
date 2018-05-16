const mongoose = require("mongoose");

let internshipSchema = new mongoose.Schema({
    title: String,
    companyName: String,
    description: String,
    location: String,
    createdAt: { type: Date, default: Date.now },
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
});

module.exports = mongoose.model("Internship", internshipSchema);