const jwt = require("jsonwebtoken");
const cartModel = require("../Models/cartModel");
const validator = require('../middleware/validation');
const aws = require('../aws/aws')
const productModel = require("../Models/productModel");
const UserModel = require("../Models/userModel");
const userModel = require("../Models/userModel");
//*********************************************************POST /users/:userId/cart (Add to cart)******************************************************************************//






//============================================Get Cart Api======================================

const getCart = async (req, res) => {
    try {
        let userId = req.params.userId
        let tokenId = req['userId']

        if (!(validator.isValid(userId))) {
            return res.status(400).send({ status: false, message: "Please Provide User Id" })
        }

        if (!(validator.isValidObjectId(userId))) {
            return res.status(400).send({ status: false, message: "This is not a valid userId" })
        }

        let checkUser = await userModel.findOne({ _id: userId })

        if (!checkUser) {
            return res.status(404).send({ status: false, message: " This User Does not exist" })
        }

        if (!(userId == tokenId)) {
            return res.status(401).send({ status: false, message: "Unauthorized User" })
        }


        let checkCart = await cartModel.findOne({ userId: userId })

        if (!checkCart) {
            return res.status(404).send({ status: false, message: "Cart Not Exist With This User" })
        }
        return res.status(200).send({ status: false, message: "User Cart Details", data: checkCart })
    }
    catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }

}

//===============================Delete Cart Api==========================================

const delCart = async (req, res) => {
    try {
        let userId = req.params.userId
        let tokenId = req['userId']

        if (!(validator.isValid(userId))) {
            return res.status(400).send({ status: false, message: "Please Provide User Id" })
        }

        if (!(validator.isValidObjectId(userId))) {
            return res.status(400).send({ status: false, message: "This is not a Valid User Id" })
        }

        let checkUser = await userModel.findOne({ _id: userId })

        if (!checkUser) {
            return res.status(404).send({ status: false, message: "This User is Not Exist" })
        }

        if (!(userId == tokenId)) {
            return res.status(401).send({ status: false, message: "Unauthorized User" })
        }

        let checkCart = await cartModel.findOne({ userId: userId })

        if (!checkCart) {
            return res.status(404).send({ status: false, message: "Cart Not Exist With This User" })
        }

        let deleteCart = await cartModel.findOneAndUpdate({ userId: userId }, { items: [], totalPrice: 0, totalItems: 0 }, { new: true })

        return res.status(200).send({ status: false, message: "Cart Successfully Deleted", data: deleteCart })

    }
    catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

module.exports = { getCart, delCart }