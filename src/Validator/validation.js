const mongoose = require("mongoose")

const isValid = function (value) {
    if (typeof value === 'undefined' || value === null) return false
    if (typeof value === 'string' && value.trim().length === 0) return false
    return true;
}


const isValidBody = function (requestBody) {
    return Object.keys(requestBody).length > 0;
}

const isValidObjectId = (ObjectId) => {
    return mongoose.Types.ObjectId.isValid(ObjectId)
}


const isValidEmail = function (value) {

    if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(value)) {
        return false
    }
    return true
}

const isValidNumber = function (value) {

    if (!(/^(?:(?:\+|0{0,2})91(\s*[\-]\s*)?|[0]?)?[6789]\d{9}$/.test(value))) {

        return false
    }
    return true
}

const isValidName = function (value) {
    if (!(/^[A-Za-z ]+$/.test(value))) {
        return false
    }
    return true
}

const isValidPassword = function (value) {
    if (!(/^[a-zA-Z0-9'@&#.\s]{8,15}$/.test(value))) {
        return false
    }
    return true
}

const isValidPincode = function (value) {
    if (!(/^[1-9]{1}[0-9]{2}[0-9]{3}$/.test(value))) {
        return false
    }
    return true
}



module.exports = {
<<<<<<< HEAD
    isValid, 
    isValidBody, 
    isValidObjectId, 
    isValidEmail, 
=======
    isValid,
    isValidBody,
    isValidObjectId,
    isValidEmail,
>>>>>>> 9b0b90f94ea8f8259fc7b4df113b9c1bb1310ee5
    isValidNumber,
    isValidName,
    isValidPassword,
    isValidPincode

}