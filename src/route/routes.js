const express= require("express")
const router= express.Router()
const userController = require("../controller/userController")
const book = require("../controller/bookController")


router.post('/register', userController.createUser)
 
router.post("/login", userController.loginUser)

// book api
router.post("/books",book.createBook)





module.exports = router;