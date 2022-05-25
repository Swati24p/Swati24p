const express = require("express");
const router = express.Router();
const { createUser, login, getUser, update } = require("../controllers/UserController");
const { postProducts, getProduct, getIdproducts, putIdProducts } = require("../controllers/productController");
const auth = require('../middleware/auth');



// FEATURE-1 User APIs
router.post("/register", createUser);
router.post("/login", login);
router.get("/user/:userId/profile", auth.authentication, getUser);
router.put("/user/:userId/profile", auth.authentication, update);

// FEATURE-2 Products API
router.post("/products", postProducts);
router.get("/products", getProduct);
router.get("/products/:productId", getIdproducts);
router.put("/products/:productId", putIdProducts);
// router.delete("/products/:productId", dProducts);


// FEATURE-3 Cart APIs
// router.post("/users/:userId/cart");
// router.put("/users/:userId/cart");
// router.get("/users/:userId/cart");
// router.delete("/users/:userId/cart");


// FEATURE-4 Checkout/Order APIs
// router.post("/users/:userId/orders");
// router.put("/users/:userId/orders");



module.exports = router;