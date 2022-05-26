const productModel = require("../Models/productModel");
const validator = require('../middleware/validation');
const aws = require('../aws/aws');


//====================================================Post/Create Product Api=============================================================================//

const postProducts = async function (req, res) {
    try {
        let body = JSON.parse(JSON.stringify(req.body));
        const { title, description, price, currencyId, currencyFormat, isFreeShipping, style, availableSizes, installments } = body;

        let files = req.files;
        let uploadedFileURL = await aws.uploadFile(files[0]);
        productImage = uploadedFileURL;

        let userData = { title, description, price, currencyId, currencyFormat, isFreeShipping, productImage, style, availableSizes, installments };
        const savedData = await productModel.create(userData);
        res.status(201).send({ status: true, message: 'Success', data: savedData });

    } catch (err) {
        res.status(500).send({ status: false, msg: err.message });
    }
};

//======================================================get Products from Query params===================================================================//

const getProduct = async (req, res) => {
    try {
        let filterQuery = req.query;
        let { size, name, priceGreaterThen, priceLessThen, priceSort } = filterQuery;

        if (size || name || priceGreaterThen || priceLessThen || priceSort) {
            let query = { isDeleted: false }

            if (size) {
                query['availableSizes'] = size
            }

            if (name) {
                query['title'] = { $regex: name }
            }

            if (priceGreaterThen) {
                query['price'] = { $gt: priceGreaterThen }
            }

            if (priceLessThen) {
                query['price'] = { $lt: priceLessThen }
            }

            if (priceGreaterThen && priceLessThen) {
                query['price'] = { '$gt': priceGreaterThen, '$lt': priceLessThen }
            }

            if (priceSort) {
                if (!(priceSort == -1 || priceSort == 1)) {
                    return res.status(400).send({ status: false, message: "You can only use 1 for Ascending and -1 for Descending Sorting" })
                }
            }

            let getAllProduct = await productModel.find(query).sort({ price: priceSort })

            if (!(getAllProduct.length > 0)) {
                return res.status(404).send({ status: false, message: "Products Not Found" })
            }
            return res.status(200).send({ status: true, count: getAllProduct.length, message: "Success", data: getAllProduct })
        }
        else {
            return res.status(400).send({ status: false, message: "Invalid Request Query Params" })
        }

    }
    catch (error) {
        return res.status(500).send({ status: false, error: error.message })

    }
}

//======================================================Get products by path params===================================================================//

const getIdproducts = async (req, res) => {

    try {
        const data = req.params.productId

        //check wheather objectId is valid or not--
        if (!validator.isValidObjectId(data)) {
            return res.status(400).send({ status: false, message: "please enter valid productId" })
        }

        //find the productId which is deleted key is false--
        let product = await productModel.findOne({ _id: data, isDeleted: false })

        if (!product) {
            return res.status(404).send({ status: false, message: "No Products Available!!" })
        }

        return res.status(200).send({ status: true, count: product.length, message: 'Success', data: product });
    }
    catch (error) {
        res.status(500).send({ Error: error.message })
    }
}



//*************************************************************Update products by productId**********************************************************************//

const putIdProducts = async (req, res) => {

    try {
        // Validate body
        const body = req.body
        if (!validator.isValidBody(body)) {
            return res.status(400).send({ status: false, msg: "Product details must be present" })
        }

        const params = req.params;

        //validate productId
        if (!validator.isValidObjectId(params.productId)) {
            return res.status(400).send({ status: false, message: "please enter valid productId" })
        }

        const { title, description, price, isFreeShipping, style, availableSizes, installments } = body

        // if (price) {
        //     if (!validator.isValidPrice(price)) {
        //         return res.status(400).send({ status: false, msg: "Invalid price format" })
        //     }

        // }
        // if (availableSizes) {
        //     if (!validator.isValidSize(availableSizes)) {
        //         return res.status(400).send({ status: false, msg: " You trying to enter Invalid Size" })
        //     }
        // }
        
        const searchProduct = await productModel.findOne({ _id: params.productId, isDeleted: false })
        if (!searchProduct) {
            return res.status(404).send({ status: false, msg: "ProductId does not exist" })
        }

        let files = req.files;
        if (files && files.length > 0) {
            var uploadedFileURL = await aws.uploadFile(files[0]);
        }
        const finalproduct = {
            title, description, price, currencyId: "₹", currencyFormat: "INR", isFreeShipping, productImage: uploadedFileURL, style: style, availableSizes, installments
        }

        let updatedProduct = await productModel.findOneAndUpdate({ _id: params.productId }, finalproduct, { new: true })
        return res.status(200).send({ status: true, msg: "Updated Successfully", data: updatedProduct })

    }
    catch (error) {
        res.status(500).send({ Error: error.message })
    }
}


// ******************************************************** DELETE /products/:productId ******************************************************* //

const deleteById = async function (req, res) {
    try {

        const productId = req.params.productId

        if (!validator.isValidObjectId(productId)) {
            return res.status(400).send({ status: false, msg: `this ${productId} is not valid` })
        }

        let deletedProduct = await productModel.findById({ _id: productId })
        if (!deletedProduct) {
            return res.status(404).send({ status: false, msg: `this ${productId} is not exist in db` })
        }

        if (deletedProduct.isDeleted !== false) {
            return res.status(400).send({ status: false, msg: `this ${productId} is already deleted` })
        }

        await productModel.findByIdAndUpdate({ _id: productId }, { $set: { isDeleted: true, deletedAt: new Date() } }, { new: true })

        return res.status(200).send({ status: true, msg: "successfully deleted" })

    }

    catch (err) {
        console.log("This is the error :", err.message)
        res.status(500).send({ msg: "Error", error: err.message })
    }
}



module.exports = { postProducts, getProduct, getIdproducts, putIdProducts, deleteById };


/////////////////////////////////////////////////////////////// END OF PRODUCT CONTROLLER ///////////////////////////////////////////////////
