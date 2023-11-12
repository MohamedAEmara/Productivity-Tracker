const express = require('express');
const router = express.Router();

const { getSignupPage, getLoginPage, loginUser, signupUser } = require('../controllers/userController');
const { isVerified } = require('../controllers/authController');



router
    .route('/auth/signup')
    .get(getSignupPage)
    .post(signupUser);

router
    .route('/auth/login')
    .get(getLoginPage)
    .post(isVerified, loginUser);



    
module.exports = router;