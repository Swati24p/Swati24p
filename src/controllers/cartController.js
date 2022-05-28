const jwt = require("jsonwebtoken");
const cartModel = require("../Models/cartModel");
const validator = require('../middleware/validation');
const aws = require('../aws/aws')


//*********************************************************POST /users/:userId/cart (Add to cart)******************************************************************************//