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
        if (Object.keys(data).length == 0 || data == null) {
            return res.status(400).send({ status: false, message: "No details provided by user" })
        }
        let check = await bookModel.findOne({ bookId: bookId, isDeleted: false })
        if (!check) {
            return res.status(404).send({ status: false, message: "book document does'nt exist" })
        }

        const { review, reviewedBy, rating } = data

        // review validation
        if (!isValid(review)) {
            return res.status(400).send({ status: false, message: " review key is required" })
        }

        if (!isValid(reviewedBy)) {
            return res.status(400).send({ status: false, message: "reviewedBy key is required" })
        }

        if (!isValid(rating)) {
            return res.status(400).send({ status: false, message: "rating key is required" })
        }

        if (rating < 1 || rating > 5) {
            return res.status(400).send({ status: false, message: "please mention the rating in between 1 to 5" })
        }

        data["reviewedAt"] = Date.now()
        data["bookId"] = bookId

        const saveReview = await reviewsModel.create(data)
        return res.status(201).send({ status: true, message: 'Success', data: saveReview })
    }
    catch (err) {
        console.log(err.message)
        return res.status(500).send({ status: "error", msg: err.message })
    }
}


module.exports = { createReview }



