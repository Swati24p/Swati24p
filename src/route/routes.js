const express= require("express")
const router= express.Router()
const userController = require("../controller/userController")
const login = require("../controller/login")


router.post('/register', userController.createUser)
 
router.post("/login", login.loginUser)





module.exports = router;