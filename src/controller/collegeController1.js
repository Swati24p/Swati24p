const mongoose = require("mongoose");
const collegeModel = require("../models/collegeModel");
const internModel = require("../models/internModel");



//---------------------------------------------------- API 1-------------------------------------------------------//
// POST /functionup/colleges
// Create a college - a document for each member of the group
// The logo link will be provided to you by the mentors.
//  This link is a s3 (Amazon's Simple Service) url. Try accessing the link to see if the link is public or not.


const createCollege = async function (req, res) {
try {
     let {name, fullName, logoLink} = req.body
     const requestbody = req.body;
     
     if(Object.keys(requestbody).length === 0) {
         return res.status(400).send({
             status: false,
             msg: "data should be present for further request."
         });
         
     }
      
     if (!name) {
         return res.status(400).send ({ status:false, msg:"name should be present" })
    }

    if(!fullName) { 
        return res.status(400).send ({ status:false,msg:"fullName should be present"})
}

    if(!logoLink){ return res.status(400).send ({ status:false, msg:"logoLink should be present" })
}

//logolinkvalidation-
const validlogoLink =
      /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-/]))?/.test (
        req.body.logoLink
      );
    if (!validlogoLink) {
      return res.status(404).send({ status: false, message: `Invalid url` });
    }


let createCollege = await collegeModel.create(requestbody)
    return res.status(201).send({
        status: true,
        msg: createCollege
    })
}

catch (error) {
    res.status(500).send({ status: false, msg: error.message })
 }
}


//-----------------------------------------------API-3--------------------------------------------------------//
// GET /functionup/collegeDetails
// Returns the college details for the requested college (Expect a query parameter 
//by the name collegeName. This is anabbreviated college name. For example iith)
// Returns the list of all interns who have applied for internship at this college.
// The response structure should look like this

const getCollegeDetails = async function (req, res) {
try {
    let collegeName= req.query.collegeName
let getData = await collegeModel.find({name:collegeName}).select({_id:1})

let getIntern= await internModel.find({collegeId:getData})

let finalData= await collegeModel.find({name:collegeName}).select({name:1,fullName:1,logoLink:1,_id:0})

 let interests = getIntern
if(interests) {
    finalData = finalData.concat(interests) 
return res.status(200).send({ count: finalData.length, msg: finalData })}
}

catch (error) {
    res.status(500).send({ status: false, msg: error.message })
 }
}


module.exports.createCollege = createCollege
module.exports.getCollegeDetails = getCollegeDetails
