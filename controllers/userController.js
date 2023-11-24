const User = require("../models/User");
const emailValidator = require('email-validator');
const bcrypt = require('bcryptjs');

const { createAndSendToken } = require('./authController');
const { createAndSendVerificationEmail } = require("../utils/sendVerification");

exports.signupUser = async (req, res) => {
    try {
        const newUser = {
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
            confirmPassword: req.body.password,
            isVerified: false,
            profilePic: req.body.profilePic || undefined
        };
        await User.create(newUser);
        console.log('CREATED......');
        createAndSendVerificationEmail(newUser.email);
        // res.send('ok, created successfully');
        res.render('new');
    } catch (err) {
        console.log(err);
        res.send('err');
    }
}



exports.loginUser = async (req, res) => {
    try {
        // Validate Email
        const email = req.body.email || req.body.username;
        const password = req.body.password;
        console.log(email);
        console.log(password);
        if(!email || !password) {
            res.status(400).json({
                error: 'fail',
                message: 'please enter your email & password.',
            })
        }

        let user;
        if(emailValidator.validate(email)) {
            // The input is email
            user = await User.findOne({ email: email });
        } else {
            // The input is username
            user = await User.findOne({ username: email });
        }
        if(!user) {
            return res.status(401).json({
                error: 'fail',
                message: 'email or password is not correct.',
            });
        }

        // Validate Password
        const correctPassword = bcrypt.compare(password, user.password);
        if(correctPassword) {
            // Check if this user is verified.
            if(user.isVerified) {
                createAndSendToken(user, 200, res);
                res.status(200).send("You logged in successfully :)");
            } else {
                res.status(401).json({
                    error: 'fail',
                    message: 'verify your account first to login.'
                });
            }
        } else {
            res.status(401).json({
                error: 'fail',
                message: 'email or password is not correct.'
            });
        }

    } catch (err) {
        console.log(err);
    }
}


exports.uploadImage = (req, res) => {
    if (req.file) {
        res.send('File uploaded successfully!');
    } else {
        res.status(400).send('No file selected.');
    }
};