const jwt = require("jsonwebtoken")
const dotenv = require('dotenv');
dotenv.config({ path: './config/.env' });



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

module.exports = { createAndSendToken, isVerified }
