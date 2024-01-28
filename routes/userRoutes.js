const express = require('express');
const router = express.Router();

// const { getSignupPage, loginUser, signupUser } = require('../controllers/userController');
const { loginUser, signupUser, logout, updatePassword, forgotPassword, displayResetPassword, updatePassword2, displayDashboard, updateUser } = require('../controllers/userController');
const { verifyToken, isAuthorized } = require('../controllers/authController');
const { resendActivation, logoutUser } = require('../controllers/authController');
const { uploadImage } = require('../utils/upload');
const { isAuthenticated } = require('../middlewares/isAuthenticated');
const { showProfile } = require('../controllers/taskController');

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

router.post('/forgotPassword', forgotPassword);
    
router.patch('/newPass', isAuthenticated, updatePassword);

router.patch('/', isAuthenticated, updateUser);

router.get('/enterYourMail', (req, res) => {
    res.render('enter-your-mail');
})

router.get('/dashboard', isAuthenticated, displayDashboard);

router.get('/resetPassword/:token', displayResetPassword);

router.post('/resetPassword/:token', updatePassword2); 

router.get('/profile', isAuthenticated, showProfile);
module.exports = router;