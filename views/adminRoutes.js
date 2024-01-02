const express = require("express")
const admin = require("../controllers/admin")
const adminAuth = require("../controllers/adminAuth")
const {upload} = require("../middlewares/imageUpload")
const auth = require("../middlewares/auth")

const adminRoutes = express.Router()

adminRoutes.post("/register",upload.single("profileImage"),adminAuth.register)

adminRoutes.post("/login",adminAuth.login)

adminRoutes.get("/users",auth.authenticate,auth.checkRole("admin"),admin.getAllUsers)

adminRoutes.post("/users/delete",auth.authenticate,auth.checkRole("admin"),admin.deleteUsers)

adminRoutes.get("/user/:id",auth.authenticate,auth.checkRole("admin"),admin.getSpecificUser)

adminRoutes.put("/user/:id",auth.authenticate,auth.checkRole("admin"),upload.single("profileImage"),admin.editSpecificUser)

module.exports = adminRoutes