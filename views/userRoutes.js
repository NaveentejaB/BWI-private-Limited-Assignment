const express = require("express")
const user = require("../controllers/user")
const userAuth = require("../controllers/userAuth")
const {upload} = require("../middlewares/imageUpload")
const auth = require("../middlewares/auth")

const userRouter = express.Router()

userRouter.post("/register",upload.single("profileImage"),userAuth.register)

userRouter.post("/login",userAuth.login)

userRouter.get("/",auth.authenticate,auth.checkRole("user"),user.getUserData)

userRouter.put("/edit",upload.single("profileImage"),auth.authenticate,auth.checkRole("user"),user.editUserData)

userRouter.delete("/delete",auth.authenticate,auth.checkRole("user"),user.deleteUserSelf)

module.exports = userRouter