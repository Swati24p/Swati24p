//const userModel = require('../model/userModel')
const bookModel = require('../model/bookModel')
const mongoose = require("mongoose")
const reviewsModel = require('../model/reviewsModel')



//-----------------------------------------------basic validations---------------------------------------------------//

const isValidRequestBody = function (value) {
    return Object.keys(value).length > 0
}

const isValid = (value) => {
    if (typeof value == 'undefined' || value == null) return false;
    if (typeof value == 'string' && value.trim().length == 0) return false;
    // if(typeof value !== "string") return false;
    return true
}


const isValidObjectId = (value) => {
    return mongoose.isValidObjectId(value)
}
const isValidReview = (value) => {

    if (typeof value == 'string' && value.trim().length == 0) return false;

    return true
}





//------------------------------------------Post /books/:bookId/review----------------------------------------------------------------//

const createReview = async function (req, res) {

    try {

        let data = req.body
        let bookId = req.params.bookId

        if (!isValidObjectId(bookId)) {
            return res.status(400).send({ status: false, message: "plz enter valid bookId" })
        }
        let check = await bookModel.findOne({ _id: bookId, isDeleted: false }).lean()
        if (!check) {
            return res.status(404).send({ status: false, message: "book document does'nt exist" })
        }

        if (!isValidRequestBody(data)) {
            return res.status(400).send({ status: false, message: "No details provided by user" })
        }




        const { review, reviewedBy, rating } = data


        // review validation
        if (!isValid(review)) {
            return res.status(400).send({ status: false, message: " review  is required" })
        }



        if (!isValid(rating)) {
            return res.status(400).send({ status: false, message: "rating  is required" })
        }

        if (typeof rating !== "number" || (rating < 1 || rating > 5)) {
            return res.status(400).send({ status: false, message: "please enter valid rating in between 1 to 5" })
        }

        if (!isValidReview(reviewedBy)) {
            return res.status(400).send({ status: false, message: "reviewer's name  is required" })
        }



        data["reviewedAt"] = Date.now()
        data["bookId"] = bookId


        let reviewsData = await reviewsModel.create(data)


        let book = await bookModel.findByIdAndUpdate(bookId,
            { $inc: { reviews: 1 } },
            { new: true }).lean()


        await reviewsModel.find({ bookId: bookId, isDeleted: false })
        book["reviewData"] = reviewsData

        return res.status(201).send({ status: true, message: 'Success', data: book })
    }
    catch (err) {
        console.log(err.message)
        return res.status(500).send({ status: "error", msg: err.message })
    }
}

// -----------------------------------------PUT /books/:bookId/review/:reviewId----------------------------------------------------------------

const updateReview = async (req, res) => {

    try {


        const data = req.body
        const { bookId, reviewId } = req.params

        const { review, rating, reviewedBy } = data

        if (!isValidObjectId(bookId)) {
            return res.status(400).send({ status: false, message: "plz enter valid bookId" })
        }

        const checkBookId = await bookModel.findOne({ bookId, isDeleted: false }).lean()
        if (!checkBookId) {
            return res.status(404).send({ status: false, message: "No book found" })
        }

        if (!isValidObjectId(reviewId)) {
            return res.status(400).send({ status: false, message: "plz enter valid reviewId" })
        }

        const checkReviewId = await reviewsModel.findOne({ _id: reviewId, isDeleted: false, bookId: bookId })

        if (!checkReviewId) {
            return res.status(404).send({ status: false, message: "No such review found" })
        }

        let x = (!(rating || reviewedBy || review))

        if (!isValidRequestBody(data) || x) {
            return res.status(400).send({ status: false, message: "plz enter valid data for updation" })
        }
        if (rating) {
            if (typeof rating !== "number" || (rating < 1 || rating > 5)) {
                return res.status(400).send({ status: false, message: "plz enter valid rating" })
            }
        }

        if (review) {
            if (!isValid(review)) {
                return res.status(400).send({ status: false, message: "plz enter valid review" })
            }
        }

        const reviewData = await reviewsModel.findByIdAndUpdate({ _id: reviewId },
            { $set: { rating: rating, reviewedBy: reviewedBy, review: review } },
            { new: true })

        await reviewsModel.find({ bookId: bookId })

        checkBookId["reviewData"] = reviewData

        return res.status(200).send({ status: true, message: "reviews updated successfully", data: checkBookId })



    }
    catch (err) {
        return res.status(500).send({ status: "error", msg: err })
    }
}




// ---------------------------------------DELETE /books/:bookId/review/:reviewId----------------------------------------------------------//


const deleteReview = async (req, res) => {

    try {

        const reviewId = req.params.reviewId
        const bookId = req.params.bookId

        if (!isValidObjectId(bookId)) {
            return res.status(400).send({ status: false, message: "plzz enter valid book id" })
        }
        if (!isValidObjectId(reviewId)) {
            return res.status(400).send({ status: false, message: "plzz enter valid review id" })
        }
        const review = await reviewsModel.findOne({ _id: reviewId, bookId: bookId })
        if (!review) {
            return res.status(404).send({ status: false, message: "No review exists " })
        }
        if (review.isDeleted == true) {
            return res.status(404).send({ status: false, message: "review already deleted" })
        }

        const book = await bookModel.findById(bookId)
        if (!book) {

            return res.status(404).send({ status: false, message: "No book Exists" })
        }
        if (book.isDeleted == true) {
            return res.status(400).send({ status: false, message: "book already deleted" })
        }
        await reviewsModel.findOneAndUpdate({ _id: reviewId }, { $set: { isDeleted: true }, deletedAt: Date.now() }, { new: true })

        await bookModel.findByIdAndUpdate({ _id: bookId }, { $inc: { reviews: -1 } }, { new: true })

        return res.status(200).send({ status: true, message: "successfully deleted" })
    }

    catch (err) {
        console.log(err.message)
        return res.status(500).send({ status: "error", msg: err.message })
    }

}


module.exports = { createReview, updateReview, deleteReview }











//------------------------------ {120DaysFunctionUpCodingChallengeWithUranium}  -------------------------------------------//
