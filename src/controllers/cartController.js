const jwt = require("jsonwebtoken");
const cartModel = require("../Models/cartModel");
const validator = require('../middleware/validation');
const aws = require('../aws/aws')
const productModel = require("../Models/productModel");
const UserModel = require("../Models/userModel");
//*********************************************************POST /users/:userId/cart (Add to cart)******************************************************************************//