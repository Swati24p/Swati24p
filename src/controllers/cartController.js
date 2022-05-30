const cartModel = require("../Models/cartModel");
const validator = require('../middleware/validation');
const productModel = require("../Models/productModel");
const UserModel = require("../Models/userModel");
const chalk = require("chalk");



const createCart = async (req, res) => {
    try {
        const userIdFromParams = req.params.userId

        const data = req.body
        const { productId, quantity } = data

        if (!validator.isValidObjectId(userIdFromParams)) {
            return res.status(400).send({ status: false, msg: "userId is invalid" });
        }

        const userByuserId = await UserModel.findById(userIdFromParams);

        if (!userByuserId) {
            return res.status(404).send({ status: false, message: 'user not found.' });
        }

        if (req['userId'] != userIdFromParams) {
            return res.status(403).send({
                status: false,
                message: "Unauthorized access.",
            });
        }

        if (!validator.isValid(productId)) {
            return res.status(400).send({ status: false, messege: "please provide productId" })
        }

        if (!validator.isValidObjectId(productId)) {
            return res.status(400).send({ status: false, msg: "productId is invalid" });
        }

        const findProduct = await productModel.findById(productId);

        if (!findProduct) {
            return res.status(404).send({ status: false, message: 'product not found.' });
        }

        if (findProduct.isDeleted == true) {
            return res.status(400).send({ status: false, msg: "product is deleted" });
        }

        if (!validator.isValid(quantity)) {
            return res.status(400).send({ status: false, messege: "please provide quantity" })
        }

        if ((isNaN(Number(quantity)))) {
            return res.status(400).send({ status: false, message: 'quantity should be a valid number' })
        }

        if (quantity < 0) {
            return res.status(400).send({ status: false, message: 'quantity can not be less than zero' })
        }

        const isOldUser = await cartModel.findOne({ userId: userIdFromParams });

        if (!isOldUser) {
            const newCart = {
                userId: userIdFromParams,
                items: [{
                    productId: productId,
                    quantity: quantity
                }],
                totalPrice: (findProduct.price) * quantity,
                totalItems: 1
            }

            const createCart = await cartModel.create(newCart)
            return res.status(201).send({ status: true, message: "cart created successfully", data: createCart })
        }

        if (isOldUser) {
            const newTotalPrice = (isOldUser.totalPrice) + ((findProduct.price) * quantity)
            let flag = 0;
            const items = isOldUser.items
            for (let i = 0; i < items.length; i++) {
                if (items[i].productId.toString() === productId) {
                    console.log(chalk.bgBlue("productId are similars"))
                    items[i].quantity += quantity
                    var newCartData = {
                        items: items,
                        totalPrice: newTotalPrice,
                        quantity: items[i].quantity
                    }
                    flag = 1
                    const saveData = await cartModel.findOneAndUpdate(
                        { userId: userIdFromParams },
                        newCartData, { new: true })
                    return res.status(201).send({
                        status: true,
                        message: "product added to the cart successfully", data: saveData
                    })
                }
            }
            if (flag === 0) {
                console.log(chalk.yellow("productIds are not similar"))
                let addItems = {
                    productId: productId,
                    quantity: quantity
                }
                const saveData = await cartModel.findOneAndUpdate(
                    { userId: userIdFromParams },
                    { $addToSet: { items: addItems }, $inc: { totalItems: 1, totalPrice: ((findProduct.price) * quantity) } },
                    { new: true }).select({ "items._id": 0 })
                return res.status(201).send({ status: true, message: "product added to the cart successfully", data: saveData })
            }
        }
    }
    catch (error) {
        return res.status(500).json({ status: false, message: error.message });
    }
};



const updateCart = async function (req, res) {

    const body = req.body;
    if (Object.keys(body).length <= 0) {
        return res.status(400).send({ status: false, msg: "Plz enter data in body !!!" });
    }

    const cardId = req.body.cardId;
    if (!cardId) {
        return res.status(400).send({ status: false, msg: "Plz enter cardId in body !!!" });
    }

    const productId = req.body.productId;
    if (!productId) {
        return res.status(400).send({ status: false, msg: "Plz enter productId in body !!!" });
    }

    // const removeProduct = req.body.removeProduct;
    // if (!removeProduct) {
    //     return res.status(400).send({ status: false, msg: "Plz enter removeProduct in body !!!" });
    // }

    const cartExist = await cartModel.findById(cardId);
    if (!cartExist) {
        return res.status(400).send({ status: false, msg: "Card does not exist !!!" });
    }

    const userId = req.params.userId;
    const jwtUserId = req.userId;
    if (userId != jwtUserId) {
        return res.status(400).send({ status: false, msg: "Not authorized !!!" });
    }

    // const userExist = await UserModel.findOne({ _id: userId });
    // if (!userExist) {
    //     return res.status(400).send({ status: false, msg: "User does not exists !!!" });
    // }

    // const productExists = await productModel.find({ _id: productId, isDeleted: false });
    // if (!productExists) {
    //     return res.status(400).send({ status: false, msg: "Product not found !!!" });
    // }

   
    res.send("hey")
};



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

        let checkUser = await UserModel.findOne({ _id: userId })

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

};



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

        let checkUser = await UserModel.findOne({ _id: userId })

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
};



module.exports = { getCart, updateCart, delCart, createCart };