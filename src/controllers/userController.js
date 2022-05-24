const UserModel = require("../Models/userModel")
const mongoose = require("mongoose")
const aws = require("aws-sdk")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const validator = require('../Validator/validation');


// ****************************************************************** AWS-S3 ****************************************************************** //

aws.config.update({
    accessKeyId: "AKIAY3L35MCRVFM24Q7U",  // id
    secretAccessKey: "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",  // secret password
    region: "ap-south-1" 
  });
  
  
  // this function uploads file to AWS and gives back the url for the file
  let uploadFile = async (file) => {
    return new Promise(function (resolve, reject) { 
      
      let s3 = new aws.S3({ apiVersion: "2006-03-01" });
      var uploadParams = {
        ACL: "public-read", 
        Bucket: "classroom-training-bucket", // HERE
        Key: "group37/profileImages/" + file.originalname, // HERE    
        Body: file.buffer, 
      };
  
      s3.upload(uploadParams , function (err, data) {
        if (err) {
          return reject( { "error": err });
        }
        console.log(data)
        console.log("File uploaded successfully.");
        return resolve(data.Location); //HERE 
      });
    });
  };


// ************************************************************* POST /register ************************************************************ //

const createUser = async function(req,res) {
    try{
        const body = req.body
        // const body = req.body.data;
        // const JSONbody = JSON.parse(body)

        //Validate body 
        if (!validator.isValidBody(body)) {
            return res.status(400).send({ status: false, msg: "User body should not be empty" });
        }

        const {fname, lname, email, password, phone, address} = body

        // Validate fname
        if(!validator.isValid(fname)) {
            return res.status(400).send({status: false, message: "fname must be present"})
        }

        // Validation of fname
        if(!validator.isValidName(fname)) {
            return res.status(400).send({status:false, msg: "Invalid fname"})
        }

        // Validate lname
        if(!validator.isValid(lname)) {
            return res.status(400).send({status: false, message: "lname must be present"})
        }

        // Validation of lname
        if(!validator.isValidName(lname)) {
            return res.status(400).send({status:false, msg: "Invalid lname"})
        }

        // Validate email
        if(!validator.isValid(email)) {
            return res.status(400).send({status: false, message: "email must be present"})
        }

        // Validation of email id
        if(!validator.isValidEmail(email)) {
            return res.status(400).send({status: false, message: "Invalid email id"})
        }

        // Validate password
        if(!validator.isValid(password)) {
            return res.status(400).send({status: false, message: "password must be present"})
        }

        // Validation of password
        if(!validator.isValidPassword(password)) {
            return res.status(400).send({status: false, message: "Invalid password"})
        }

        // Validate phone
        if(!validator.isValid(phone)) {
            return res.status(400).send({status: false, message: "phone must be present"})
        }

        // Validation of phone number
        if(!validator.isValidNumber(phone)) {
            return res.status(400).send({status: false, msg: "Invalid phone number"})
        }

        // Validate address
        if(!validator.isValid(address)) {
            return res.status(400).send({status: false, message: "Address is required"})
        }

        // Validate shipping address
        if(!validator.isValid(address.shipping)) {
            return res.status(400).send({status: false, message: "Shipping address is required"})
        }

        // Validate street, city, pincode of shipping
        if(!validator.isValid(address.shipping.street && address.shipping.city && address.shipping.pincode)) {
            return res.status(400).send({status: false, message: "Shipping address details is/are missing"})
        }

        // Validate shipping pincode
        if(!validator.isValidPincode(address.shipping.pincode)) {
            return res.status(400).send({status: false, msg: "Invalid Shipping pincode"})
        }

        // Validate billing address
        if(!validator.isValid(address.billing)) {
            return res.status(400).send({status: false, message: "Billing address is required"})
        }

        // Validate street, city, pincode of billing
        if(!validator.isValid(address.billing.street && address.billing.city && address.billing.pincode)) {
            return res.status(400).send({status: false, message: "Billing address details is/are missing"})
        }

        // Validate billing pincode
        if(!validator.isValidPincode(address.billing.pincode)) {
            return res.status(400).send({status: false, msg: "Invalid billing pincode"})
        }


        // Duplicate entries
        const isAlredyUsed = await UserModel.findOne({phone}, {email});
        if(isAlredyUsed) {
            return res.status(400).send({status: false, message: `${phone} number or ${email} mail is already registered`})
        }


        let files = req.files;
        if (files && files.length > 0) {
        let uploadedFileURL = await uploadFile( files[0] );  
        

        // encrypted password
        const encryptPassword = await bcrypt.hash(password,10)

        profileImage = uploadedFileURL

        const userData = {fname, lname, email, profileImage, phone, password: encryptPassword, address}
        const savedData = await UserModel.create(userData)
        return res.status(201).send({status: true, message: "User created successfully", data: savedData})
        }
        else {
            return res.status(400).send({ status: false, msg: "No file to write" });
        }
        
    }
    catch (err) {
        console.log("This is the error :", err.message)
        res.status(500).send({ msg: "Error", error: err.message })
    }
}

module.exports.createUser = createUser

