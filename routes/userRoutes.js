const express = require('express');
const router = express.Router();

// const { getSignupPage, loginUser, signupUser } = require('../controllers/userController');
const { loginUser, signupUser, logoutUser } = require('../controllers/userController');
const { verifyToken } = require('../controllers/authController');
const { resendActivation } = require('../controllers/authController');
const { uploadImage } = require('../utils/upload');
const { isAuthenticated } = require('../middlewares/isAuthenticated');

router.get('/signup', (req, res) => {
    res.render('signup');
})

router.get('/login', (req, res) => {
    res.render('login');
})

router.get('/upload', (req, res) => {
    res.render('upload-image');
})

// router.post('/upload', uploadImage)
// router.get('/new/:token', verifyToken);
router.route('/new/:token').get(verifyToken);

router
    .route('/auth/signup')
    // .get(getSignupPage)
    .post(signupUser);

router
    .route('/auth/login')
    .post(loginUser);

router.post('/auth/logout', isAuthenticated, logoutUser);
router.get('/resend-activation/:token', resendActivation);

    
module.exports = router;