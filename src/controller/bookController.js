const userModel=require('../model/userModel')
const bookModel=require('../model/bookModel')
const mongoose=require("mongoose")

const isbnValid = require('isbn-validator')



// { 
//     title: {string, mandatory, unique},
//     excerpt: {string, mandatory}, 
//     userId: {ObjectId, mandatory, refs to user model},
//     ISBN: {string, mandatory, unique},
//     category: {string, mandatory},
//     subcategory: [string, mandatory],
//     reviews: {number, default: 0, comment: Holds number of reviews of this book},
//     deletedAt: {Date, when the document is deleted}, 
//     isDeleted: {boolean, default: false},
//     releasedAt: {Date, mandatory, format("YYYY-MM-DD")},
//     createdAt: {timestamp},
//     updatedAt: {timestamp},
//   }


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





const isValidObjectId =(value)=>{
    return mongoose.isValidObjectId(value)
}

const createBook=async (req,res)=>{

try{
  const data=req.body  
  if(Object.keys(data).length==0||data==null){
      return res.status(400).send({status:false,message:"No details provided by user"})
  }

  const {title,excerpt,userId,ISBN,category,subcategory,releasedAt} = data

// userId validation
  if(!isValid(userId)){
    return res.status(400).send({ status: false, message: " userId is required" })

  }
  if(!isValidObjectId(userId)){
    return res.status(400).send({ status: false, message: "plz enter valid userId" })
  }

  const Idcheck =await userModel.findOne({userId:userId})
  if(!Idcheck){
    return res.status(404).send({ status: false, message: "user not defined " })
  }

//   title validation
if(!isValid(title)){
    return res.status(400).send({ status: false, message: " title is required" })

  }
  const titleCheck =await bookModel.findOne({title:title})
  if(titleCheck){
    return res.status(409).send({ status: false, message: " this title already exist " })
  }
//   excerpt validation
if(!isValid(excerpt)){
    return res.status(400).send({ status: false, message: " excerpt is required" })

  }

//   ISBN validation
if(!isValid(ISBN)){
    return res.status(400).send({ status: false, message: " ISBN is required" })

  }
  if(!isbnValid(ISBN)){
    return res.status(400).send({ status: false, message: "  please enter valid ISBN " })
}
  const ISBNCheck =await bookModel.findOne({ISBN:ISBN})
  if(ISBNCheck){
    return res.status(409).send({ status: false, message: " this ISBN already exist " })
  }


//   category validation

if(!isValid(category)){
    return res.status(400).send({ status: false, message: " category is required" })
}
// subcategory validation

if(!Array.isArray(subcategory)){
    return res.status(400).send({ status: false, message: " subcategory should be array" })
}

// date validation
if(!isValidDate(releasedAt)){
    return res.status(400).send({ status: false, message: " released date is required" })
}

if(!/^\d{4}-\d{2}-\d{2}$/.test(releasedAt)){
    return res.status(400).send({ status: false, message: " plz enter valid date" })

}

const saveBook = await bookModel.create(data)
 return res.status(201).send({status: true,  message: 'Success', data:saveBook})

}
catch(err){
    console.log(err.message)
        return res.status(500).send({ status: "error", msg: err.message })
}



}

module.exports ={createBook}