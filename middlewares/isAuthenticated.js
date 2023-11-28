const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const BlackList = require('../models/BlackList');
dotenv.config('./config/.env');



exports.isAuthenticated = async (req, res, next) => {
    try {
        // Check for the token.
        const token = req.cookies.jwt;
        const isBlackListed = await BlackList.findOne({ token });
        if(isBlackListed) {
            return res.status(400).json({
                status: 'fail',
                message: 'Please login first to see the content!'
            });
        }
        const id = jwt.decode(token, process.env.JWT_SECRET).id;
        req.user = id;
        console.log(token);
        next();
    } catch(err) {
        console.log(err);
        res.status(400).json({
            status: 'fail',
            message: 'Please login first to see the content!'
        });
    }
}