const express = require('express');
const router = express.Router();

// const { getSignupPage, loginUser, signupUser } = require('../controllers/userController');
const { loginUser, signupUser } = require('../controllers/userController');



router
    .route('/auth/signup')
    // .get(getSignupPage)
    .post(signupUser);

router
    .route('/auth/login')
    .get(loginUser);



    
module.exports = router;