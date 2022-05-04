const mongoose = require("mongoose");
const collegeModel = require("../models/collegeModel")

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

let createCollege = await collegeModel.create(requestbody)
    return res.status(201).send({
        status: true,
        msg: createCollege
    })

}

module.exports.createCollege = createCollege

    
