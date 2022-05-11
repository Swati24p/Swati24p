const express= require("express")
const router= express.Router()
const userController = require("../controller/userController")
const book = require("../controller/bookController")
const review = require("../controller/reviewsController")


//----------------------------------------------------UserApi----------------------------------------------------------//
router.post('/register', userController.createUser)

router.post("/login", userController.loginUser)

//---------------------------------------------------BookApi------------------------------------------------------------//
router.post("/books",book.createBook)
router.get("/books",book.getBook)
router.get("/books/:bookId",book.getBooksByParams)
router.put("/books/:bookId",book.updateBooks)
router.delete("/books/:bookId",book.deleteBooks)




router.post("/books/:bookId/review",review.createReview)
router.put("/books/:bookId/review/:reviewId",review.updateReview)
router.delete("/books/:bookId/review/:reviewId",review.deleteReview)








module.exports = router;