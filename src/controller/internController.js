const mongoose = require("mongoose");
const internModel = require("../models/internModel");
const collegeModel = require("../models/collegeModel")


//Below function is to check whether the given string is a valid ObjectId or not
let isValidObjectId = (ObjectId) => {
    return mongoose.Types.ObjectId.isValid(ObjectId)
}


//-------------------------------------------PROJECT-2...API 2-------------------------------------------------------- //

// POST /functionup/interns
// Create a document for an intern.
// Also save the collegeId along with the document. Your request body contains the following fields - { name, mobile, email, collegeName}
// Return HTTP status 201 on a succesful document creation. Also return the document. The response should be a JSON object like this
// Return HTTP status 400 for an invalid request with a response body like this


const createInterns = async function (req, res) {
    try {

        let data = req.body;
        let emailId = req.body.email
        let mobileNo = req.body.mobile
        let { name, email, mobile } = data
        let collegeId = req.body.collegeId
        
        // for blank body check
        if (Object.keys(data).length === 0) {
            return res.status(400).send({
                status: false,
                msg: "data should be present for further request."
            });
        }

        // required attributes
        if (!name) {
            return res.status(400).send({ status: false, msg: "Intern name should be present" })
        }
        if (!email) {
            return res.status(400).send({ status: false, msg: "Intern email should be present" })
        }
        if (!mobile) {
            return res.status(400).send({ status: false, msg: "Intern mobile no. should be present" })
        }
        if (!collegeId) {
            return res.status(400).send({ status: false, msg: "Intern collegeId should be present" })
        }

        //ValidObjId--
        let collegeEnter;
        if (req.body.hasOwnProperty("collegeId")) {                 //if collegeId is present in request body
            if (!isValidObjectId(req.body.collegeId))               //checking whether the collegeId is valid or not
                return res.status(400).send({ status: false, msg: "Enter a valid collegeId" })
            collegeEnter = req.body.collegeId;                      //getting collegeId from request body
        }

        //when college deleted=true once--
        let del = await collegeModel.findById(collegeId).select({ isDeleted: 1, _id: 0 })
        if (del.isDeleted == true) {
            return res.status(404).send({ msg: "College is already deleted cannot able to create intern" })
        }

        // Email validations
        if (emailId) {
            let validmail = /^\w+([\.-]?\w+)@\w+([\. -]?\w+)(\.\w{2,3})+$/.test(emailId);
            if (!validmail) { return res.status(400).send({ status: false, message: "Enter an valid email" });
            }
        }

        let emailValidate = await internModel.findOne({ email: emailId })

        if (emailValidate) {
            return res.status(409).send({ status: false, msg: "e-Mail registered already" })
        }
        
        // Mobile validations 
        const validMobile = /^(\+\d{1,3}[- ]?)?\d{10}$/.test(mobile);
        if (!validMobile) { return res.status(400).send({ status: false, msg: "Enter valid mobile number" }) }

        let mobileValidate = await internModel.findOne({ mobile: mobileNo })
        if (mobileValidate) {
            return res.status(400).send({ status: false, msg: "Mobile number already registered" })
        }

        // data creation
        let createInterns = await internModel.create(data)
        return res.status(201).send({ status: true, msg: createInterns })
    }

    catch (error) {
        res.status(500).send({ status: false, msg: error.message })
    }
}


module.exports.createInterns = createInterns

