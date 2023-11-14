const express = require('express');
const router = express.Router();

// const { getSignupPage, loginUser, signupUser } = require('../controllers/userController');
const { loginUser, signupUser } = require('../controllers/userController');
const { verifyToken } = require('../controllers/authController');


router.get('/signup', (req, res) => {
    res.render('signup');
})


// router.get('/new/:token', verifyToken);
router.route('/new/:token').get(verifyToken);

router
    .route('/auth/signup')
    // .get(getSignupPage)
    .post(signupUser);

router
    .route('/auth/login')
    .get(loginUser);



    
module.exports = router;