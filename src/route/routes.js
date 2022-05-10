const express= require("express")
const router= express.Router()
const userController = require("../controller/userController")
const book = require("../controller/bookController")


//----------------------------------------------------UserApi----------------------------------------------------------//
router.post('/register', userController.createUser)

router.post("/login", userController.loginUser)

//---------------------------------------------------BookApi------------------------------------------------------------//
router.post("/books",book.createBook)
router.put("/books/:bookId",book.updateBooks)


router.get("/books",book.getBook)

router.post("/books/:bookId",book.getBookbyparams)

router.delete("/books/:bookId",book.deleteBooks)





module.exports = router;