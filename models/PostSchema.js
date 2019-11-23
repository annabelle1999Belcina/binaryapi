const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = Schema({
    foodName: {type: String,required:true},
    description:{type: String,required:true},
    image:{type: Object,required:true},
    ingredients:{type: String,required:true},
    procedure:{type:String,required:true}
});

const User = mongoose.model("User", userSchema);
module.exports = User;