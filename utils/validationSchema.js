const Joi = require("joi")
const passwordComplexity = require('joi-password-complexity') 
Joi.objectId = require("joi-objectid")(Joi)

module.exports.adminsignUpValidation = (body) => {
    const schema = Joi.object({
        email : Joi.string().email().label("email"),
        phoneNumber :  Joi.number().integer().min(1000000000).max(9999999999).label("phoneNumber"),
        name : Joi.string().min(1).max(30).label("name"),
        profileImage : Joi.string().min(0).label("profileImage"),
        password : Joi.string().label("password").required()
    }).or('email','phoneNumber').required()
    return schema.validate(body)
}

module.exports.adminLoginValidation = (body) => {
    const schema = Joi.object({
        email : Joi.string().email().label("email"),
        phoneNumber :  Joi.number().integer().min(1000000000).max(9999999999).label("phoneNumber"),
        password : Joi.string().required().label("password")
    }).or('email','phoneNumber').required()
    return schema.validate(body)
}

module.exports.userSignUpValidation = (body) => {
    const schema = Joi.object({
        email : Joi.string().email().label("email"),
        phoneNumber :  Joi.number().integer().min(1000000000).max(9999999999).label("phoneNumber"),
        name : Joi.string().min(1).max(30).label("name"),
        profileImage : Joi.string().min(0).label("profileImage"),
        password : Joi.string().label("password").required()
    }).or('email','phoneNumber').required()
    return schema.validate(body)
}

module.exports.userLoginValidation = (body) => {
    const schema = Joi.object({
        email : Joi.string().email().label("email"),
        phoneNumber :  Joi.number().integer().min(1000000000).max(9999999999).label("phoneNumber"),
        password : Joi.string().label("password").required()
    }).or('email','phoneNumber').required()
    return schema.validate(body)
}

module.exports.adminSpecificUserEditValidation = (body) => {
    const schema = Joi.object({
        name :  Joi.string().min(3).max(30).label("name"),
        profileImage : Joi.string().min(0).label("profileImage"),
    })
    return schema.validate(body)
}

module.exports.userSpecificUserEditValidation = (body) => {
    const schema = Joi.object({
        name :  Joi.string().min(0).max(30).label("name"),
        profileImage : Joi.string().min(0).label("profileImage")
    })
    return schema.validate(body)
}

module.exports.adminUsersDeleteValidation = (body) => {
    const schema = Joi.object({
        userIds : Joi.array().items(Joi.objectId().required()).label("userIds")
    })
    return schema.validate(body)
}

