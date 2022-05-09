const userModel = require ("../model/userModel");

const isValidRequestBody = function (value) {
    return Object.keys(value).length > 0
}

const isValid = (value) => {
    if (typeof value == 'undefined' || typeof value == null) return false;
    if (typeof value == 'string' && value.trim().length == 0) return false;
    return true

}

const isValidTitle=function(title){
    return ['Mr','Mrs','Miss'].indexOf(title)!=-1
}

const createUser=async function (req,res){
        let requestBody=req.body

    //validation of request body and keys

      if(!isValidRequestBody(requestBody)){
          res.status(400).send({status:false,message:"invalid request parameters.plzz provide  user details"})
          return
      }
      const{title,name,email,password,phone,address}=requestBody

      if(!isValid(title)){
        res.status(400).send({status:false,message:"Title is required"})
        return
      }
      if(!isValidTitle(title)){
        return   res.status(400).send({status:false,message:"plzz enter valid title"})
      }

      if(!isValid(name)){
        res.status(400).send({status:false,message:"name is required"})
        return
      }

      if (!/^[A-Za-z\s]{1,}[\.]{0,1}[A-Za-z\s]{0,}$/.test(name)) {
        return res.status(400).send({ status: false, message: "Please enter valid user name." })
    }

    if(!isValid(email)){
        return  res.status(400).send({status:false,message:"plzz enter email"})
    }

    const emailPattern = /^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})/
        if (!email.match(emailPattern)) {
            return res.status(400).send({ status: false, msg: "This is not a valid email" })
        }

        const emailExt=await userModel.findOne({email:email})
        
            if(emailExt){
                return res.status(409).send({status:false,message:"Email already exists"})
            }
        

        if(!isValid(password)){
             return res.status(400).send({status:false,message:"plzz enter password"})
        }
        if(password.length<8 || password.length>15 ){
            return res.status(400).send({status:false, message:"plzz enter valid password"})
        }

        if(!isValid(phone)){
          return  res.status(400).send({status:false,message:"plzz enter mobile"})
        }

        if (!/^(\+\d{1,3}[- ]?)?\d{10}$/.test(phone)) {
            return res.status(400).send({ status: false, message: "Please enter valid 10 digit mobile number. " })
        }

        // let document ={
        //     title,
        //     name,
        //     email,
        //     password,
        //     phone

        // }
        const {street,city,pincode} = address

        // if(address){
        //     if (street){
        //         if(typeof address.street == "string")
        //     }

        // }

        const phoneExt=await userModel.findOne({phone:phone})
        
            if(phoneExt){
                return res.status(409).send({status:false,message:"phone number already exists"})
            }
         

            let saveData=await userModel.create(requestBody)
            return res.status(201).send({status:true,message:"success",data:saveData})
        
        







    
}







module.exports.createUser = createUser;
