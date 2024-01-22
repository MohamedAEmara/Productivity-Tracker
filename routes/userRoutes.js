const express = require('express');
const router = express.Router();

// const { getSignupPage, loginUser, signupUser } = require('../controllers/userController');
const { loginUser, signupUser, logout, updatePassword, forgotPassword, displayResetPassword, updatePassword2 } = require('../controllers/userController');
const { verifyToken, isAuthorized } = require('../controllers/authController');
const { resendActivation, logoutUser } = require('../controllers/authController');
const { uploadImage } = require('../utils/upload');
const { isAuthenticated } = require('../middlewares/isAuthenticated');

router.get('/signup', (req, res) => {
    res.render('signup');
})

router.get('/login', (req, res) => {
    res.render('login');
})

router.get('/upload', isAuthorized, (req, res) => {
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

router.post('/auth/logout', isAuthenticated, logout);
router.get('/resend-activation/:token', resendActivation);

router.get('/changePassword', isAuthorized, (req, res) => {
    res.render('change-password');
})

router.post('/forgotPassword', isAuthenticated, forgotPassword);
    
router.patch('/newPass', isAuthenticated, updatePassword);



router.get('/resetPassword/:token', displayResetPassword);

router.post('/resetPassword/:token', updatePassword2); 
module.exports = router;