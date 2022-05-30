const orderModel = require("../models/orderModel");



const postOrder = async function (req, res) {
    try {
        res.status(201).send({ status: true, msg: "Success !!!" });
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