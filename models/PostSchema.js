const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = Schema({
    userName:{type: String,required:true},
    foodName: {type: String,required:true},
    description:{type: String,required:true},
    image:{type: String,default: "none",required: true},
    imageData : {type : String,required : true},
    ingredients:{type: String,required:true},
    procedure:{type:String,required:true},
    postDate: {type: Date},
    comments: {
		type: Array
  },
  like:{type:Array}
	// user:{
	// 	type: Array
	// },
});

const Post = mongoose.model("Post", userSchema);
module.exports = Post;