const express = require("express");
const router = express.Router();
const { createUser, login, getUser,update } = require("../controllers/UserController");
const auth = require('../middleware/auth');

//===================userModel Api===========================================================//

router.post("/register", createUser);
router.post("/login", login);
router.get("/user/:userId/profile", auth.authentication, getUser);
router.put("/user/:userId/profile",auth.authentication,update)
module.exports = router;