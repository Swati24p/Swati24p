const orderModel = require("../models/orderModel");
const UserModel = require("../Models/userModel");
const cartModel = require("../Models/cartModel");



const postOrder = async function (req, res) {
    try {
        const data = req.body;
        if (Object.keys(data).length <= 0) {
            return res.status(400).send({ status: false, msg: "Plz enter data in body !!!" });
        }

        const userId = req.params.userId;
        const userFind = await UserModel.findOne({ _id: userId });
        if (!userFind) {
            return res.status(400).send({ status: false, msg: "User not found !!!" });
        }

        const jwtUserId = req.userId;
        if (jwtUserId != userId) {
            return res.status(400).send({ status: false, msg: "Not authorized !!!" });
        }

        const cartId = req.body.cartId;
        if (!cartId) {
            return res.staus(400).send({ status: false, msg: "Plz enter cartId in body !!!" });
        }

        const userCart = await cartModel.findOne({ _id: cartId, userId: userId });
        if (!userCart) {
            return res.status(400).send({ status: false, msg: "User does not have any cart !!!" });
        }

        let checkTotalQuantity = 0;
        for (let i = 0; i < userCart.items.length; i++) {
            checkTotalQuantity = checkTotalQuantity + userCart.items[i].quantity;
        }

        const orderDetails = {
            userId: userId,
            items: userCart.items,
            totalPrice: userCart.totalPrice,
            totalItems: userCart.totalItems,
            totalQuantity: checkTotalQuantity
        }
        
        const saveData = await orderModel.create(orderDetails);
        res.status(201).send({ status: true, message: 'Success', data: saveData });
    } catch (err) {
        res.status(500).send({ status: false, msg: err.message });
    }
};



const putOrder = async function (req, res) {
    try {
        res.status(200).send({ status: true, msg: "Success !!!" });
    } catch (err) {
        res.status(500).send({ status: false, msg: err.message });
    }
};



module.exports = { postOrder, putOrder };