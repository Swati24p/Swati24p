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
       // let data = req.body
        let body = JSON.parse(JSON.stringify(req.body))
        // body.address = JSON.parse(body.address)


        //Validate body 

        if (!validator.isValidBody(body)) {
            return res.status(400).send({ status: false, msg: "User body should not be empty" });
        }

        let {fname, lname, email, password, phone, address} = body

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
        if(!address) {
            return res.status(400).send({status: false, message: "Address is required"})
        }
        address = JSON.parse(address)
        // Validate shipping address
        if(!address.shipping) {
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
        email = email.toLowerCase().trim()
        let isAlredyUsed = await UserModel.findOne({email});
        if(isAlredyUsed) {
            return res.status(400).send({status: false, message: ` ${email} mail is already registered`})
        }
        
        let duplicatePhone = await UserModel.findOne({phone});
        if(duplicatePhone){
            return res.status(400).send({status:false, message:`${phone} phone is already used`})
        }


        let files = req.files;
        if (files && files.length > 0) {
        let uploadedFileURL = await uploadFile( files[0] );  
        

        // encrypted password
        let encryptPassword = await bcrypt.hash(password,12)

        profileImage = uploadedFileURL
        body.address = JSON.parse(body.address)
        let userData = {fname, lname, email, profileImage, phone, password: encryptPassword, address}
      
        let savedData = await UserModel.create(userData)
        return res.status(201).send({status: true, message: "User created successfully", data: savedData})
        }
        else {
            return res.status(400).send({ status: false, msg: "No file found" });
        }
<<<<<<< HEAD

        if (!isValidRequestBody(data)) {
            res.status(400).send({ status: false, message: "invalid request parameters.plzz provide user details" })
            return
        }

        //Validate attributes --
        let { fname, lname, email, password, phone, address } = data

        if (!isValid(fname)) {
            res.status(400).send({ status: false, message: " first name is required" })
            return
        }
        if (!/^[A-Za-z\s]{1,}[\.]{0,1}[A-Za-z\s]{0,}$/.test(fname)) {
            return res.status(400).send({ status: false, message: "Please enter valid user first name." })
        }


        // name validation
        if (!isValid(lname)) {
            res.status(400).send({ status: false, message: "last name is required" })
            return
        }

        //this will validate the type of name including alphabets and its property withe the help of regex.
        if (!/^[A-Za-z\s]{1,}[\.]{0,1}[A-Za-z\s]{0,}$/.test(lname)) {
            return res.status(400).send({ status: false, message: "Please enter valid user last name." })
        }

        //Email Validation --
        if (!isValid(email)) {
            return res.status(400).send({ status: false, message: "plzz enter email" })
        }
        const emailPattern = /^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})/       //email regex validation for validate the type of email.

        if (!email.match(emailPattern)) {
            return res.status(400).send({ status: false, message: "This is not a valid email" })
        }

        email = email.toLowerCase().trim()
        const emailExt = await userModel.findOne({ email: email })
        if (emailExt) {
            return res.status(409).send({ status: false, message: "Email already exists" })
        }

        //Password Validations--
        if (!isValid(password)) {
            return res.status(400).send({ status: false, message: "plzz enter password" })
        }
        if (password.length < 8 || password.length > 15) {
            return res.status(400).send({ status: false, message: "plzz enter valid password" })
        }


        //Phone Validations--
        if (!isValid(phone)) {
            return res.status(400).send({ status: false, message: "plzz enter mobile" })
        }

        //this regex will to set the phone no. length to 10 numeric digits only.
        if (!/^(\+91)?0?[6-9]\d{9}$/.test(phone)) {
            return res.status(400).send({ status: false, message: "Please enter valid 10 digit mobile number." })
        }

        const phoneExt = await userModel.findOne({ phone: phone })
        if (phoneExt) {
            return res.status(409).send({ status: false, message: "phone number already exists" })
        }

        //for address--

        // this validation will check the address is in the object format or not--
        if (!address) {
            return res.status(400).send({ status: false, message: "address is required" })
        }

         if (typeof address != "object") {
         return res.status(400).send({ status: false, message: "address should be an object" })
         }
        let { shipping, billing } = address

        if (!shipping) {
            return res.status(400).send({ status: false, message: "shipping is required" })
        }

        if (typeof shipping != "object") {
            return res.status(400).send({ status: false, message: "shipping should be an object" })
        }
        if (!billing) {
            return res.status(400).send({ status: false, message: "billing is required" })
        }

        if (typeof billing != "object") {
            return res.status(400).send({ status: false, message: "billing should be an object" })
        }

        if (!isValid(shipping.street)) {
            return res.status(400).send({ status: false, message: "shipping street is required" })
        }

        if (!isValid(shipping.city)) {
            return res.status(400).send({ status: false, message: "shipping city is required" })
        }
        if (!/^[a-zA-Z]+$/.test(shipping.city)) {
            return res.status(400).send({ status: false, message: "city field have to fill by alpha characters" });
        }


        if (!isValid(shipping.pincode)) {
            return res.status(400).send({ status: false, message: "shipping street is required" })
        }

        //applicable only for numeric values and extend to be 6 characters only--
        if (!/^\d{6}$/.test(shipping.pincode)) {
            return res.status(400).send({ status: false, message: "plz enter valid pincode" });
        }

        if (!isValid(billing.street)) {
            return res.status(400).send({ status: false, message: "billing street is required" })
        }


        if (!isValid(billing.city)) {
            return res.status(400).send({ status: false, message: "billing city is required" })
        }
        if (!/^[a-zA-Z]+$/.test(billing.city)) {
            return res.status(400).send({ status: false, message: "city field have to fill by alpha characters" });
        }


        if (!isValid(billing.pincode)) {
            return res.status(400).send({ status: false, message: "billing street is required" })
        }

        //applicable only for numeric values and extend to be 6 characters only--
        if (!/^\d{6}$/.test(billing.pincode)) {
            return res.status(400).send({ status: false, message: "plz enter valid  billing pincode" });
        }

        let saveData = await userModel.create(data)
        return res.status(201).send({ status: true, message: "success", data: saveData })

=======
        
>>>>>>> c530940631c62a9639905eb58fa6e14628a0ae8d
    }
    catch (err) {
        console.log("This is the error :", err.message)
        res.status(500).send({ msg: "Error", error: err.message })
    }
}

<<<<<<< HEAD
module.exports = { createUser }

// =====================Get  user Api=================

const getUser = async (req,res) =>{
    try{
        let userId = req.params.userId
        let tokenId = req.userId


        if(!validator.isValid(userId)){
            return res.status(400).send({status:false , message:"Please Provide " })
        }


    }
    catch(error){

    }
}

=======
module.exports.createUser = createUser
>>>>>>> c530940631c62a9639905eb58fa6e14628a0ae8d

