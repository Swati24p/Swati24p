const express = require("express");
const router = express.Router();
const { createUser, login, getUser, update } = require("../controllers/UserController");
const { pProducts } = require("../controllers/productController");
const auth = require('../middleware/auth');



// User APIs
router.post("/register", createUser);
router.post("/login", login);
router.get("/user/:userId/profile", auth.authentication, getUser);
router.put("/user/:userId/profile", auth.authentication, update);

// Products API
router.post("/products", pProducts);
// router.get("/products", gProducts);
// router.get("/products/:productId", gIdProducts);
// router.put("/products/:productId", pIdProducts);
// router.delete("/products/:productId", dProducts);

// Cart APIs
// router.post("/users/:userId/cart");
// router.put("/users/:userId/cart");
// router.get("/users/:userId/cart");
// router.delete("/users/:userId/cart");

// Checkout/Order APIs
// router.post("/users/:userId/orders");
// router.put("/users/:userId/orders");



module.exports = router;