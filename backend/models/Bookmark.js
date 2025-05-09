const mongoose = require("mongoose")


const bookmarkSchema = new mongoose.Schema({
   userId:mongoose.Schema.Types.ObjectId,
   url:String,
   title:String,
   summary:String,
   favicon:String,
   tags: [String],
});

module.exports = mongoose.model("Bookmark",bookmarkSchema);