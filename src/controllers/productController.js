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
        let { size, name, priceGreaterThan, priceLessThan, priceSort } = filterQuery;

        if (size || name || priceGreaterThan || priceLessThan || priceSort) {
            let query = { isDeleted: false }

            if (size) {
                query['availableSizes'] = size
            }

            if (name) {
                query['title'] = { $regex: name }
            }

            if (priceGreaterThan) {
                query['price'] = { $gt: priceGreaterThan }
            }

            if (priceLessThan) {
                query['price'] = { $lt: priceLessThan }
            }

            if (priceGreaterThan && priceLessThan) {
                query['price'] = { '$gt': priceGreaterThan, '$lt': priceLessThan }
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
            return res.status(200).send({ status: true, message: "Success", data: getAllProduct })
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



//========================================================Update products by productId======================================================================//

const putIdProducts = async (req, res) => {

    try {

    }
    catch (error) {
        res.status(500).send({ Error: error.message })
    }
}


module.exports = { postProducts, getProduct, getIdproducts, putIdProducts };