const mongoose = require("mongoose")

const isValid = function (value) {
    if (typeof value === 'undefined' || value === null) return false
    if (typeof value === 'string' && value.trim().length === 0) return false 
    return true;
} 


const isValidBody = function (requestBody) {
    return Object.keys(requestBody).length > 0;
}

const isValidobjectId = (objectId) => {
    return mongoose.Types.ObjectId.isValid(objectId)
}

const isValidString = function (value) {
    if (typeof value === 'string' && value.trim().length === 0) return false  
    return true;
}

const isValidEmail = function (value) {
    
    if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(value.trim())) {
        return false
    }
    return true
}

const isValidNumber = function (value) {
    
        if (!(/^(?:(?:\+|0{0,2})91(\s*[\-]\s*)?|[0]?)?[6789]\d{9}$/.test(value.trim()))) {
            
        return false
    }
    return true
}

const isValidName = function(value) {
    if (!(/^[A-Za-z ]+$/.test(value.trim()))) {
        return false
    }
    return true
}

const isValidPassword = function(value) {
    if(!(/^[a-zA-Z0-9'@&#.\s]{8,15}$/.test(value.trim()))) {
        return false
    }
    return true
}

const isValidPincode = function(value) {
    if(!(/^[1-9]{1}[0-9]{2}[0-9]{3}$/.test(value.trim()))) {
        return false
    }
    return true
}



module.exports = {
    isValid, 
    isValidBody, 
    isValidobjectId,
    isValidString, 
    isValidEmail, 
    isValidNumber,
    isValidName, 
    isValidPassword,
    isValidPincode
    
}