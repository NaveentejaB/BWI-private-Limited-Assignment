const Admin = require("../models/admin_model")
const User = require("../models/user_model")
const adminValidations = require("../utils/validationSchema")


module.exports.getAllUsers = async(req,res) =>{
    const users = await User.find({})
    return res.status(200).json({
        users : users,
        message : `fetched all the users.`,
        success : true
    })
}

module.exports.getSpecificUser = async(req,res) =>{
    const {id} = req.params
    const user = await User.findOne({_id:id})
    if(!user){
        return res.status(404).json({
            message : `user with id  doesn't exist.`,
            success : false
        })
    }
    return res.status(200).json({
        user : user,
        message : `fetched the user with id : ${id}.`,
        success : true
    })
}

module.exports.deleteUsers = async(req,res) =>{
    const {error} = adminValidations.adminUsersDeleteValidation(req.body)
    if (error){
        return res.status(400).json({ 
            error: true, 
            message: error.details[0].message
        })
    }
    const {userIds} = req.body //array of user ids
    const deleteUsers = await User.deleteMany({_id:{$in:userIds}})
    return res.status(204).json({
        message : `${userIds.length} users were deleted.`,
        success : true
    })
}

module.exports.editSpecificUser = async(req,res) =>{
    const {id} = req.params
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
    const {error} = adminValidations.adminSpecificUserEditValidation(req.body)
    if (error){
        return res.status(400).json({ 
            error: true, 
            message: error.details[0].message
        })
    }

    let imagePath = user.userProfileImage
    if(req.file){
        console.log(2222);
        const url = req.protocol+"://"+req.get('host')
        imagePath = url+"/public/profileImages/"+req.file.filename
    }
    const updateUser = await User.findOneAndUpdate({_id:id},{
        userProfileImage : imagePath,
        userName : req.body.name 
    })
    return res.status(200).json({
        message : `edited the details of user with id:${id}`,
        success : true
    })
}