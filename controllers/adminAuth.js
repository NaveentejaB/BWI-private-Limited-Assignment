const Admin = require("../models/admin_model")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const adminValidation = require("../utils/validationSchema")

module.exports.register = async(req,res) =>{
    const { error } = adminValidation.adminsignUpValidation(req.body);
    console.log(error);
		if (error)
			return res.status(400).json({ 
                error: true, 
                message: error.details[0].message
            })

    const {name,phoneNumber, email,password} = req.body
    let imagePath = ""
    if(req.file){
        const url = req.protocol+"://"+req.get('host')
        imagePath = url+"/public/profileImages/"+req.file.filename
    }             
    const admin = await Admin.findOne({$or:[{adminPhoneNumber:phoneNumber},{adminEmail:email}]})
    if(admin){
        return res.status(400).json({
                message : `mobile number or email are already registered.`,
                success : false    
            })
    }  
    const salt = await bcrypt.genSalt(Number(process.env.SALT))
    const hashPassword = await bcrypt.hash(password, salt)
    await new Admin({
        adminEmail : email,
        adminPhoneNumber:phoneNumber,
        adminName:name,
        adminProfileImage:imagePath,
        adminPassword : hashPassword
    }).save()
    return res.status(201).json({
            message : `admin account created successfully.`,
            success : true
        })
}

module.exports.login = async(req,res) => {
    const { error } = adminValidation.adminLoginValidation(req.body);
		if (error)
			return res.status(400).json({ 
                error: true, 
                message: error.details[0].message 
            })
    const {email, password, phoneNumber} = req.body

    let query = {$or:[{adminPhoneNumber:phoneNumber},{adminEmail:email}]}
    if(email && phoneNumber ){
        query = {$and:[{adminPhoneNumber:phoneNumber},{adminEmail:email}]}
    }
    const admin = await Admin.findOne(query)
    if(!admin){
        return res.status(401).json({
            message : `admin with given email or mobile number does't exist.`,
            success : false
        })
    }
    const verifiedPassword = await bcrypt.compare(
        password,
        admin.adminPassword
    )
    if (!verifiedPassword)
        return res.redirect(401,"/admin/login").json({ 
            success: false, 
            message: "Invalid  password" 
        })
    
    const payload = { id:admin._id , role :"admin"}

    const accessToken = jwt.sign(
        payload,
        process.env.ACCESS_TOKEN_PRIVATE_KEY,
        { expiresIn: "30m" }
    )	
    return res.status(200).json({
        redirectUrl :"",
        accessToken,
        success: true,
        message: "Logged in sucessfully",
    })
}