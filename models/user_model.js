const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    userEmail : {
        type:String,
        unique:true
    },
    userPhoneNumber : {
        type:Number,
        unique:true
    },
    userName : {
        type:String,
        required:true
    },
    userProfileImage:{
        type:String
    },
    userPassword : {
        type:String,
        required:true
    },
    
})

const User = mongoose.model("User",userSchema)

module.exports = User