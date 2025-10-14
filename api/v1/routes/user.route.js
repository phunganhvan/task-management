const express = require('express');
const router= express.Router();
const controller = require('../controllers/user.controller')
const userValidates= require("../validates/user.validate")

router.post("/register", userValidates.registerPost ,controller.register);
router.post("/login", userValidates.loginPost ,controller.login);
router.post("/password/forgot", userValidates.forgotPasswordPost, controller.forgotPassword)


module.exports = router;