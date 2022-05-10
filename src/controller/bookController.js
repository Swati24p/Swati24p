const userModel=require('../model/userModel')
const bookModel=require('../model/bookModel')




const isValidRequestBody = function (value) {
    return Object.keys(value).length > 0
}

const isValid = (value) => {
    if (typeof value == 'undefined' || typeof value == null) return false;
    if (typeof value == 'string' && value.trim().length == 0) return false;
    return true
}

const createBook=async (req,res)=>{

try{
  const data=req.body  
  if(Object.keys(data).length==0||data==null){
      return res.status(400).send({status:false,message:"No details provided by user"})
  }

  const{title,excerpt}




}



}