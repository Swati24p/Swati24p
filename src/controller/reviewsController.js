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
const isValidDate = (value) => {
    if (typeof value == 'undefined' || typeof value == null) return false;
    return true
}

const isValidObjectId = (value) => {
    return mongoose.isValidObjectId(value)
}



//------------------------------------------Post /books/:bookId/review----------------------------------------------------------------//

const createReview = async function (req, res) {

    try {
        let data = req.body
        let bookId = req.params.bookId

        if(!isValidObjectId(bookId)){
            return res.status(400).send({ status: false, message: "plz enter valid bookId" }) 
        }
        if (!isValidRequestBody(data)) {
            return res.status(400).send({ status: false, message: "No details provided by user" })
        }
        let check = await bookModel.findOne({ _id: bookId, isDeleted: false }).lean()
        if (!check) {
            return res.status(404).send({ status: false, message: "book document does'nt exist" })
        }

        const { review, reviewedBy, rating } = data

        // review validation
        if (!isValid(review)) {
            return res.status(400).send({ status: false, message: " review key is required" })
        }

       

        if (!isValid(rating)) {
            return res.status(400).send({ status: false, message: "rating  is required" })
        }

        if (typeof rating !== "number" || (rating < 1 || rating > 5)) {
            return res.status(400).send({ status: false, message: "please mention the rating in between 1 to 5" })
        }

        data["reviewedAt"] = Date.now()
        data["bookId"] = bookId

        const saveReview = await reviewsModel.create(data)

        
           const book= await bookModel.findByIdAndUpdate({ _id:bookId },
                { $inc: { reviews: 1 } },
                { new: true}).lean()
                
        
        const reviewData= await reviewsModel.find({bookId:bookId,isDeleted:false})
        book["reviewData"]=reviewData

        return res.status(201).send({ status: true, message: 'Success', data: book })
    }
    catch (err) {
        console.log(err.message)
        return res.status(500).send({ status: "error", msg: err.message })
    }
}

// ---------------------------------------------------------------------------------------------------------

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

        const updatedReview = await reviewsModel.findByIdAndUpdate({ _id: reviewId },
            { $set: { rating: rating, reviewedBy: reviewedBy, review: review } },
            { new: true })

     const reviewData= await reviewsModel.find({bookId:bookId})

        checkBookId["reviewData"] = reviewData

        return res.status(200).send({ status: true, message: "reviews updated successfully", data: checkBookId })



    }
    catch (err) {
        return res.status(500).send({ status: "error", msg: err })
    }
}




// -------------------------------------------------------------------------------------------------


//delete api


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
        let deleteReview = await reviewsModel.findOneAndUpdate({ _id: reviewId }, { $set: { isDeleted: true }, deletedAt: Date.now() }, { new: true})

        await bookModel.findOneAndUpdate({ _id: bookId }, { $inc: { review: -1 } }, { new: true}) 

        return res.status(200).send({status:true,message:"successfully deleted"})


    }

    catch (err) {
        console.log(err.message)
        return res.status(500).send({ status: "error", msg: err.message })
    }

}


module.exports = { createReview, deleteReview, updateReview }



