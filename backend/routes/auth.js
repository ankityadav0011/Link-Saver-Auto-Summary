const express = require("express");
const brcypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const User = require("../models/User")
const router = express.Router();
const {register,login} = require("../controllers/auth")


router.post("/register",register)
router.post("/login",login);

module.exports = router;