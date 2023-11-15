const jwt = require("jsonwebtoken")
const dotenv = require('dotenv');
dotenv.config({ path: './config/.env' });
const User = require('../models/User');
const { createAndSendVerificationEmail } = require("../utils/sendVerification");

const signToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
}


const createAndSendToken = (user, statusCode, res) => {
    const token = signToken(user.email);
    
    res.cookie("jwt", token, {
        httpOnly: true,
        secure: true,
        expires: new Date(Date.now() + parseInt(process.env.JWT_EXPIRES_IN))
    });
}



const isVerified = (req, res, next) => {
    const user = req.user;

    if(user.isVerified) {
        return next();
    } else {
        return res.status(401).json({
            error: 'fail',
            message: 'UnAuthorized. verify your account to login',
        });
    }
}


const verifyToken = async (req, res) => {
    const token = req.params.token;
    const secret = process.env.JWT_SECRET;

    try {
        const decoded = jwt.decode(token, secret);
        const email = decoded.email;
        const expirationTime = new Date(decoded.exp * 1000);

        if(expirationTime >= Date.now()) {
            await User.findOneAndUpdate({ email }, { isVerified: true });
            console.log("user verified successfully :)");
            res.render('firstWelcome');
        } else {
            console.log('Token time out.');
            res.render('expired', { token: token });
        }
    } catch (err) {
        // res.render('expired', { token: token });
        console.log(err);
    }
}


const resendActivation = (req, res) => {
    const token = req.params.token;
    const secret = process.env.JWT_SECRET;

    try {
        const decoded = jwt.decode(token, secret);
        const email = decoded.email;
        createAndSendVerificationEmail(email);
        res.render('new');
    } catch (err) {
        console.log(err);
    }
}
module.exports = { createAndSendToken, isVerified, verifyToken, resendActivation }
