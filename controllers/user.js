const User = require("../models/user_model")
const jwt = require("jsonwebtoken")
const userValidations = require("../utils/validationSchema")

module.exports.getUserData = async(req,res) =>{
	const decoded = jwt.decode(req.headers["x-access-token"])
    const id = decoded.id
    const user =await User.findOne({_id:id})
    return res.status(200).json({
        user : user,
        message : `fetched the details of user with id:${id}`,
        success : true
    })
}

module.exports.editUserData = async(req,res) =>{
    const id = jwt.decode(req.headers["x-access-token"]).id
    const user = await User.findOne({_id:id})
    if(!user){
        return res.status(404).json({
            message : `user with id  doesn't exist.`,
            success : false
        })
    }
    if(req.body.name === ''){
        req.body.name = user.userName
    }
    const {error} = userValidations.userSpecificUserEditValidation(req.body)
    if (error){
        return res.status(400).json({ 
            error: true, 
            message: error.details[0].message
        })
    }	
    
    let imagePath = user.userProfileImage
    if(req.file){
        const url = req.protocol+"://"+req.get('host')
        imagePath = url+"/public/profileImages/"+req.file.filename
    }
    const updateUser = await User.findOneAndUpdate({_id:id},{
        userProfileImage : imagePath,
        userName : req.body.name
    })
    return res.status(200).json({
        updateUser,
        message : `edited the details of user with id:${id}`,
        success : true
    })
}  

module.exports.deleteUserSelf = async(req,res) =>{
    const id = jwt.decode(req.headers["x-access-token"]).id
    const deleteUser = await User.findOneAndDelete({_id:id})
    return res.status(204).json({
        message : `user account with id:${id} deleted`,
        success : true
    })
}