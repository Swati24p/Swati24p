const jwt = require("jsonwebtoken");

const userModel = require ("../model/userModel");

const isValidRequestBody =(value)=>{
  return Object.keys(value).length>0
}

const isValid =(value)=>{
  if(typeof value ==="undefined"||value ===null) return false
  if(typeof value ==="string"&& value.trim().length ===0) return false
  return true
}



const loginUser = async function (req, res) {
    try{
       const data = req.body;
       if(!isValidRequestBody(data)) return res.status(400).send({status:false,msg:"Please enter  mail and password"})
     
        const{email,password}= data
        // validation for login

      if(!isValid(email)) {
        return res.status(400).send({status:false,msg:"please enter email"})
      }

      if(!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)){
        return res.status(400).send({status:false,msg:"please enter valid email address"})
      }

      if(!isValid(password)) {
        return res.status(400).send({status:false,msg:"please enter password"})
      }

      if(password.length<8 || password.length>15 ){
        return res.status(400).send({status:false, message:"plzz enter valid password"})
    }

   
      let user = await userModel.findOne({ email, password});
      if (!user)
        return res.status(404).send({status: false, msg: "Please enter a valid email address and password"});
   
      let token = jwt.sign(
        {
          userId: user._id.toString(),
          iat: Math.floor(Date.now() / 1000),
          exp: Math.floor(Date.now() / 1000) + 10 * 60 * 60
        },
        "project-3"
      );
      
      
      res.setHeader("x-api-key", token);
      return res.status(200).send({ status: true,message:"success" ,data: token });
    }
    catch(err){
      console.log(err.message)
       return res.status(500).send({status:"error",msg:err.message})
    }
  }

module.exports.loginUser=loginUser