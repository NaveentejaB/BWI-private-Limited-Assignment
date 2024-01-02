const jwt = require("jsonwebtoken")

module.exports.authenticate = async (req, res, next) => {
	const token = req.headers["x-access-token"] 
	if (!token)
		return res.status(403).json({ 
            error: true, 
            message: "Access Denied: No token provided" 
        })
	try {
		console.log(token);
		console.log(process.env.ACCESS_TOKEN_PRIVATE_KEY);
		let isJwtValid = false
		const tokenDetails = jwt.verify(token,process.env.ACCESS_TOKEN_PRIVATE_KEY,(err,data)=>{
			console.log(err);
			// console.log(data);
			if(err)
				{return;}
			isJwtValid=true
		})
		if(!isJwtValid){
			res.status(403).json({
			error:true,
			message:"Invalid token"
		})
		}
		req.user = tokenDetails
		next()
	} catch (err) {
		console.log(err)
		res.status(403).json({ 
            error: true, 
            message: "Access token is expired" 
        })
	}
}

module.exports.checkRole = (permission) =>{
    return (req, res, next) =>{
		const token = req.headers["x-access-token"]
		const decoded = jwt.decode(token)
        const userRole = decoded.role	
        if(permission == userRole){
            next()
        }else{
            return res.status(403).json({
                 message: 'Unauthorized access', 
            });
        }
    }
}

