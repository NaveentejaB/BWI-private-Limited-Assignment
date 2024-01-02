const User = require("../models/user_model")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const userValidation = require("../utils/validationSchema")

module.exports.register = async(req,res) =>{
    console.log(11);
    console.log(req.body);
    const { error } = userValidation.userSignUpValidation(req.body);
    console.log(error);
		if (error)
			return res.status(400).json({ 
                error: true, 
                message: error.details[0].message
            })

    const {name,phoneNumber, email, type,password} = req.body
    let  imagePath = ""
    if(req.file){
        const url = req.protocol+"://"+req.get('host')
        imagePath = url+"/public/profileImages/"+req.file.filename
    }
    
    const user = await User.findOne({$or:[{userPhoneNumber:phoneNumber},{userEmail:email}]})
    if(user){
        return res.status(400).json({
                message : `mobile number or email are already registered.`,
                success : false    
            })
    }  
    const salt = await bcrypt.genSalt(Number(process.env.SALT))
    const hashPassword = await bcrypt.hash(password, salt)
    const newUser = new User({
        userEmail : email,
        userPhoneNumber:phoneNumber,
        userName:name,
        userProfileImage:imagePath,
        userPassword : hashPassword
    })
    await newUser.save()
    return res.status(201).json({
            user : newUser,
            message : `user account created successfully.`,
            success : true
        })
}

module.exports.login = async(req,res) => {
    const { error } = userValidation.userLoginValidation(req.body);
		if (error)
			return res.status(400).json({ 
                error: true, 
                message: error.details[0].message 
            })
    
    const {email, password, phoneNumber} = req.body

    const user = await User.findOne({$or:[{userPhoneNumber:phoneNumber},{userEmail:email}]})
    if(!user){
        return res.status(401).json({
            message : `user with email : ${email} does't matched.`,
            success : false
        })
    }
    const verifiedPassword = await bcrypt.compare(
        password,
        user.userPassword
    )
    if (!verifiedPassword)
        return res.redirect(401,"/user/login").json({ 
            success: false, 
            message: "Invalid  password" 
        })
    
    const payload = { id:user._id , role :"user"}

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