const express = require('express');
const router = express.Router();
const passport = require('passport');
const userController = require('../controller/user');
const catchAsync = require('../utils/catchAsync');

const multer = require('multer');
const { storage } = require('../cloudinary/index');
const upload = multer({ storage });

router.route('/register')
    .get(userController.renderRegisterForm)
    .post(upload.single('image'), catchAsync(userController.register))

router.route('/login')
    .get(userController.renderLogin)
    .post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/user/login' }), userController.login)

router.get('/logout', userController.logout);

module.exports = router;