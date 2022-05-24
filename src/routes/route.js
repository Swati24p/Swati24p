const express = require("express");
const router = express.Router();
const { createUser, login, getUser } = require("../controllers/UserController");
const auth = require('../middleware/auth');


router.post("/register", createUser);
router.post("/login", login);
router.get("/user/:userId/profile", auth.authentication, getUser);

module.exports = router;