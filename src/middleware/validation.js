const mongoose = require("mongoose");
const productModel = require("../Models/productModel");


//this validation will check the type of values--
const isValid = function (value) {
    if (typeof value === 'undefined' || value === null) return false
    if (typeof value === 'string' && value.trim().length === 0) return false
    return true;
};
//this validbody checks the validation for the empty body
const isValidBody = function (requestBody) {
    return Object.keys(requestBody).length > 0;
};
//checks wheather object id is valid or not
const isValidObjectId = (ObjectId) => {
    return mongoose.Types.ObjectId.isValid(ObjectId)
};
//checs valid type of email--
const isValidEmail = function (value) {

    if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(value)) {
        return false
    }
    return true
};
//checks valid type of number
const isValidNumber = function (value) {

    if (!(/^(?:(?:\+|0{0,2})91(\s*[\-]\s*)?|[0]?)?[6789]\d{9}$/.test(value))) {

        return false
    }
    return true
};
//valid type of name
const isValidName = function (value) {
    if (!(/^[A-Za-z ]+$/.test(value.trim()))) {
        return false
    }
    return true
};
//
const isValidPassword = function (value) {
    if (!(/^[a-zA-Z0-9'@&#.\s]{8,15}$/.test(value))) {
        return false
    }
    return true
};
//
const isValidPincode = function (value) {
    if (!(/^\d{6}$/.test(value))) {
        return false
    }
    return true
};
//
const isValidPrice = function(value) {
    if(!/^\d+(,\d{3})*(\.\d{1,2})?$/.test(value)){
        return false
    }
    return true
};
//
<<<<<<< HEAD

const isValidSize = (Arr) => {
    let newArr = []
    if (!Arr.length > 0)
        return false

    for (let i = 0; i < Arr.length; i++) {
        if (!["S", "XS", "M", "X", "L", "XXL", "XL"].includes(Arr[i].toUpperCase())) {
            return false
        }
        newArr.push(Arr[i].toUpperCase())
    }
    return newArr
}
=======
const isValidSize = function (value) {
    return ["S", "XS", "M", "X", "L", "XXL", "XL"].indexOf(value) !== -1
};

>>>>>>> bca27c91bbd4fa00dd2244c8652d565331ae397a

const validProduct = async function (req, res, next) {
    try {
        let body = JSON.parse(JSON.stringify(req.body));
        if (Object.keys(body).length == 0) {
            return res.status(400).send({ status: false, msg: "Plz Enter Data Inside Body !!!" });
        }

        const { title, description, price, currencyId, currencyFormat, availableSizes, installments } = body;

        if (!title) {
            return res.status(400).send({ status: false, msg: "Plz Enter title In Body !!!" });
        }

        if(!isValidName(title)) {
            return res.status(400).send({ status: false, msg: "Please mention valid title In Body !!!" });
        }

        const findTitle = await productModel.findOne({ title: title });
        if (findTitle) {
            return res.status(400).send({ status: false, msg: "Title Is Already Exists, Plz Enter Another One !!!" });
        }

        if (!description) {
            return res.status(400).send({ status: false, msg: "Plz Enter description In Body !!!" });
        }

        if (!price) {
            return res.status(400).send({ status: false, msg: "Plz Enter price In Body !!!" });
        }
        if (!isValidPrice(price)) {
            return res.status(400).send({ status: false, msg: "Plz Enter valid format price In Body !!!" });
        }

        if (!currencyId) {
            return res.status(400).send({ status: false, msg: "Plz Enter currencyId In Body !!!" });
        }
        if (currencyId != 'INR') {
            return res.status(400).send({ status: false, msg: "Plz Enter currencyID in INR format !!!" });
        }
        if (!currencyFormat) {
            return res.status(400).send({ status: false, msg: "Plz Enter currencyFormat In Body !!!" });
        }

        if (currencyFormat != '₹') {
            return res.status(400).send({ status: false, msg: "Plz Use Indian Currency Format(₹) In Body !!!" });
        }

        if (!availableSizes) {
            return res.status(400).send({ status: false, msg: "Plz Enter availableSizes In Body !!!" });
        }
<<<<<<< HEAD
        const availableSizesArr = JSON.parse(availableSizes)
        if (!isValidSize(availableSizesArr)) {
            return res.status(400).send({ status: false, msg: `please Enter Available Size from ["S", "XS", "M", "X", "L", "XXL", "XL"]`})
        }
            if (isNaN(installments) == true) {
                return res.status(400).send({ status: false, msg: "Plz Enter Number In installments !!!" });
            }
=======

>>>>>>> bca27c91bbd4fa00dd2244c8652d565331ae397a

        let clean = availableSizes.replace(/[^0-9A-Z]+/gi, "");
        let values = clean.split('');
        for (let i = 0; i < values.length; i++) {
            if ((values[i] == 'S') || (values[i] == 'XS') || (values[i] == 'M') || (values[i] == 'X') || (values[i] == 'L') || (values[i] == 'XXL') || (values[i] == 'XL')) {
            } else {
                return res.status(400).send({ status: false, msg: "Plz Enter availableSizes From S, XS, M, X, L, XXL, XL" });
            }
        };

        if (isNaN(installments) == true) {
            return res.status(400).send({ status: false, msg: "Plz Enter Number In installments !!!" });
        }

        let files = req.files;
        if (!(files && files.length > 0)) {
            return res.status(400).send({ status: false, msg: "Enter File In Body !!!" });
        }
        next();
    }
    catch (err) {
        res.status(500).send({ status: false, msg: err.message });
    }
<<<<<<< HEAD
}
module.exports = { isValid, isValidBody, isValidObjectId, isValidEmail, isValidNumber, isValidName, isValidPassword, isValidPincode, isValidPrice, isValidSize ,validProduct };
=======
};


module.exports = { isValid, isValidBody, isValidObjectId, isValidEmail, isValidNumber, isValidName, isValidPassword, isValidPincode, isValidPrice, isValidSize, validProduct };
>>>>>>> bca27c91bbd4fa00dd2244c8652d565331ae397a
