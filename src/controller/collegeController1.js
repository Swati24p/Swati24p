const mongoose = require("mongoose");
const collegeModel = require("../models/collegeModel");


//---------------------------------------------------- API 1-------------------------------------------------------//
// POST /functionup/colleges
// Create a college - a document for each member of the group
// The logo link will be provided to you by the mentors.
//  This link is a s3 (Amazon's Simple Service) url. Try accessing the link to see if the link is public or not.


const createCollege = async function (req, res) {

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



module.exports.createCollege = createCollege

