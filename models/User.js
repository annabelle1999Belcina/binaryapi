const mongoose = require('mongoose');
// const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;

const userSchema = Schema({
    firstName: {type: String,required:true},
    lastName:{type: String,required:true},
    gender:{type: String,required:true},
    userName:{type: String,required:true},
    email:{type:String,required:true},
    password:{type: String,required:true},
    // isDeleted: {type: Boolean,default: false},
    signUpDate: {type: Date,default: Date.now()}
});
// userSchema.methods.generateHash = function(password) {
//     return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
//   };
// userSchema.methods.validPassword = function(password) {
//     return bcrypt.compareSync(password, this.password);
//   };

var User = mongoose.model("User", userSchema);
module.exports = User;