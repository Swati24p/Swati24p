const userModel = require('../model/userModel')
const bookModel = require('../model/bookModel')
const mongoose = require("mongoose")
const isbnValid = require('isbn-validator')
const { findOne } = require('../model/userModel')

//-----------------------------------------------basic validations---------------------------------------------------//

const isValidRequestBody = function (value) {
  return Object.keys(value).length > 0
}

const isValid = (value) => {
  if (typeof value == 'undefined' || typeof value == null) return false;
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


//-------------------------------------------------------POST /books---------------------------------------------------------//

const createBook = async (req, res) => {
  try {

    const data = req.body
    if (Object.keys(data).length == 0 || data == null) {
      return res.status(400).send({ status: false, message: "No details provided by user" })
    }

    const { title, excerpt, userId, ISBN, category, subcategory, releasedAt } = data

    // userId validation
    if (!isValid(userId)) {
      return res.status(400).send({ status: false, message: " userId is required" })

    }
    if (!isValidObjectId(userId)) {
      return res.status(400).send({ status: false, message: "plz enter valid userId" })
    }

    const Idcheck = await userModel.findOne({ userId: userId })
    if (!Idcheck) {
      return res.status(404).send({ status: false, message: "user not defined " })
    }

    //title validation --
    if (!isValid(title)) {
      return res.status(400).send({ status: false, message: " title is required" })
    }
    const titleCheck = await bookModel.findOne({ title: title })
    if (titleCheck) {
      return res.status(409).send({ status: false, message: " this title already exist " })
    }

    //excerpt validation
    if (!isValid(excerpt)) {
      return res.status(400).send({ status: false, message: " excerpt is required" })

    }

    //ISBN validation
    if (!isValid(ISBN)) {
      return res.status(400).send({ status: false, message: " ISBN is required" })

    }
    if (!isbnValid(ISBN)) {
      return res.status(400).send({ status: false, message: "  please enter valid ISBN " })
    }
    const ISBNCheck = await bookModel.findOne({ ISBN: ISBN })
    if (ISBNCheck) {
      return res.status(409).send({ status: false, message: " this ISBN already exist " })
    }


    //category validation
    if (!isValid(category)) {
      return res.status(400).send({ status: false, message: "category is required" })
    }

    // subcategory validation

    if (!Array.isArray(subcategory)) {
      return res.status(400).send({ status: false, message: " subcategory should be array" })
    }

    // date validation
    if (!isValidDate(releasedAt)) {
      return res.status(400).send({ status: false, message: " released date is required" })
    }

    if (!/^\d{4}-\d{2}-\d{2}$/.test(releasedAt)) {
      return res.status(400).send({ status: false, message: " plz enter valid date" })

    }

    const saveBook = await bookModel.create(data)
    return res.status(201).send({ status: true, message: 'Success', data: saveBook })

  }
  catch (err) {
    console.log(err.message)
    return res.status(500).send({ status: "error", msg: err.message })
  }
}


//--------------------------------------------------GET /books-------------------------------------------------------//

const getBook = async (req, res) => {
  try {

    const data = req.query

    const books = await bookModel.find({ isDeleted: false })
      .select({ _id: 1, title: 1, excerpt: 1, userId: 1, category: 1, releasedAt: 1, reviews: 1 })
      .sort({ 'title': 1 })

    if (books.length == 0)
      return res.status(404).send({ status: false, msg: "No books Available." })
    return res.status(200).send({ status: true, count: books.length, msg: 'book list', data: books });
  }

  catch (error) {
    res.status(500).send({ status: 'error', Error: error.message })
  }
}


//-----------------------------------------------GET /books/:bookId------------------------------------------------------//

const getBookbyparams = async (req, res) => {
  try {

    const data = req.query
    let bookId = req.params._Id
    const book = await bookModel.find({ $and: [data, { isDeleted: false }] })

    if (bookId.length == 0)
      return res.status(404).send({ status: false, msg: "No books Available." })
    return res.status(200).send({ status: true, count: bookId.length, msg: 'book list', data: bookId });
  }

  catch (error) {
    res.status(500).send({ status: 'error', Error: error.message })
  }
}



//-----------------------------------------------DELETE /books/:bookId-------------------------------------------------//

const deleteBooks = async (req, res) => {

  try {
    let id = req.params.bookId

    if (!isValid(id)) {

      return res.status(400).send({ status: false, message: "please enter valid id" })
    }

    const findBook = await bookModel.findById({ _id: id })
    if (!findBook) {
      return res.status(404).send({ status: false, message: 'No book found' })
    }

    else if (findBook.isDeleted == true) {

      return res.status(400).send({ status: false, message: "book has been already deleted" })
    }

    else {
      let deleteData = await bookModel.findOneAndUpdate({ _id: id }, { isDeleted: true, deletedAt: Date.now() }, { new: true })
      return res.status(200).send({ status: true, message: "deleted", data: deleteData })
    }

  }

  catch (err) {
    console.log(err.message)
    return res.status(500).send({ status: "error", msg: err.message })
  }

}



const updateBooks = async function (req, res) {
  try {
    let title = req.body.title
    let excerpt = req.body.excerpt
    let releasedAt = req.body.releasedAt
    let ISBN = req.body.ISBN
    let bookId = req.params.bookId
    let book = await bookModel.findOne({_id:bookId,isDeleted:false})
    if(!book){
      return res.status(409).send({status:false, message:"No Book Found"})

    }
    let allbook = await bookModel.findByIdAndUpdate(
      {_id:bookId, isDeleted:false},
      {$set:{title:title, excerpt:excerpt, releasedAt:Date.now(),ISBN: ISBN}},
      {new:true})
      return res.status(200).send({ status: true, message: 'Success', data: allbook})
    
       } catch (err) {
    return res.status(500).send({status:false, msg:err.message})

  }
}
  








module.exports = { createBook, deleteBooks, getBook, getBookbyparams,updateBooks }
