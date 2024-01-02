const multer = require("multer")

// storage middleware for uploading images
const storage = multer.diskStorage({
    destination:'./public/profileImages',
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, uniqueSuffix + '-' + file.originalname)
    },
})

// creating a multer instance with the specified storage
const upload = multer({
    storage: storage,
    fileFilter:(req, file, cb)=>{
        if(
            file.mimetype == 'image/jpeg' ||
            file.mimetype == 'image/jpg' ||
            file.mimetype == 'image/png' 
        ){
            cb(null, true);
        }
        else{
            cb(null, false);
            cb(new Error('Only jpeg,  jpg , and png Image allowed'))
        }
    }
})

module.exports = {upload}