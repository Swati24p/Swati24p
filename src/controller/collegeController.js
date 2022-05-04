const mongoose = require("mongoose");
const collegeModel = require("../models/collegeModel");
const internModel = require("../models/internModel");
const emailValidator= require("email-validator")

let isValidObjectId= (ObjectId)=> {
    return mongoose.Types.ObjectId.isValid(ObjectId)
}




// API 1 //
const createCollege = async function (req, res) {

     let{name, fullName, logoLink} = req.body
     const requestbody = req.body;
     
     if(Object.keys(requestbody).length === 0){
         return res.status(400).send({
             status: false,
             msg: "data should be present for further request."
         });
     }
      
     if (!name) {
         return res.status(400).send ({
             status:false,
             msg:"name should be present"
         })
    }

    if(!fullName){
        return res.status(400).send ({
             status:false,
             msg:"fullName should be present"
    })
}

    if(!logoLink){
        return res.status(400).send ({
             status:false,
             msg:"logoLink should be present"
    })
}
// //  URL validation
// let validator = value => validator.isURL(value, { protocols: ['http','https','ftp'], 
// require_: true, require_protocol: true })
// return res.send({message: 'Must be a Valid URL'})

let createCollege = await collegeModel.create(requestbody)
    return res.status(201).send({
        status: true,
        msg: createCollege
    })

}

//API 2 //

const createInterns = async function (req, res) {
    try{
let data= req.body;
let emailId= req.body.email
let mobileNo = req.body.mobile
let {name, email, mobile} = data

// for blank body check
if(Object.keys(data).length === 0){
    return res.status(400).send({
        status: false,
        msg: "data should be present for further request."
    });
}
// required attributes
if (!name) {
    return res.status(400).send ({
        status:false,
        msg:"name should be present"
    })
}
if (!email) {
    return res.status(400).send ({
        status:false,
        msg:"email should be present"
    })
}
if (!mobile) {
    return res.status(400).send ({
        status:false,
        msg:"mobile no. should be present"
    })
}

// let isValidObjId= 


// Email validations
if (!(emailValidator.validate(data.email))){
    return res.status(409).send({ status: false, msg: "Enter valid email id" })}


let emailValidate = await internModel.findOne({email:emailId})
if(emailValidate){return res.status(400).send ({
    status:false,
    msg:"Mail already registered"})}

// URL validation

  
// Mobile validations

    // let mobileStr= mobileNo.toString()
    
    if((mobileNo.toString().length)!=10)
    return res.status(400).send({status:false, msg:"Mobile number is not valid"})

    let mobileValidate = await internModel.findOne({mobile:mobileNo})
    if(mobileValidate)
    {return res.status(400).send ({status:false,msg:"Mobile number already registered"})}

// data creation
let createInterns = await internModel.create(data)
    return res.status(201).send({
        status: true,
        msg: createInterns
    })

}
catch (error) {
    res.status(500).send({ status: false, msg: error.message })
}
}


module.exports.createCollege = createCollege
module.exports.createInterns=createInterns

    
