const mongoose = require("mongoose")

const adminSchema = new mongoose.Schema({
    adminEmail : {
        type:String,
        unique:true
    },
    adminPhoneNumber : {
        type:Number,
        unique:true
    },
    adminName : {
        type:String,
        required:true
    },
    adminProfileImage:{
        type:String
    },
    adminPassword : {
        type:String,
        required:true
    },
    role : {
        type:String,
        default:"admin"
    }
})

const Admin = mongoose.model("Admin",adminSchema)

module.exports = Admin