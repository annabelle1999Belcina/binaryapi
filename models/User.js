const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = Schema({
    fname: {type: String,required:true},
    lname:{type: String,required:true},
    gender:{type: String,required:true},
    userName:{type: String,required:true},
    email:{type:String,required:true},
    password:{type: String,required:true},
    // isDeleted: {type: Boolean,default: false},
    // signUpDate: {type: Date,default: Date.now()}
});

var User = mongoose.model("User", userSchema);
module.exports = User;