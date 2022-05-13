const express= require("express")
const router= express.Router()
const userController = require("../controller/userController")
const book = require("../controller/bookController")
const review = require("../controller/reviewsController")
const middleWare = require("../middleWare/auth")


//----------------------------------------------------UserApi----------------------------------------------------------//
router.post('/register', userController.createUser)

router.post("/login", userController.loginUser)

//---------------------------------------------------BookApi------------------------------------------------------------//

router.post("/books",middleWare.validateToken, book.createBook)

router.get("/books",middleWare.validateToken, book.getBook)

router.get("/books/:bookId",middleWare.validateToken, book.getBooksByParams)

router.put("/books/:bookId",middleWare.validateToken, book.updateBooks)

router.delete("/books/:bookId",middleWare.validateToken, book.deleteBooks)

//---------------------------------------------------ReviewApi------------------------------------------------------------//

router.post("/books/:bookId/review", review.createReview)

router.put("/books/:bookId/review/:reviewId",review.updateReview)

router.delete("/books/:bookId/review/:reviewId",review.deleteReview)








module.exports = router;