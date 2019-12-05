const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = Schema({
    userId:{type: String,required:true},
    foodName: {type: String,required:true},
    description:{type: String,required:true},
    image:{type: String,default: "none",required: true},
    ingredients:{type: String,required:true},
    procedure:{type:String,required:true},
    postDate: {type: Date,default: Date.now()}
});

const Post = mongoose.model("Post", userSchema);
module.exports = Post;