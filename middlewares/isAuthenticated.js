const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const BlackList = require('../models/BlackList');
dotenv.config('./config/.env');



exports.isAuthenticated = async (req, res, next) => {
    try {
        // req.cookies.jwt
        // // Check for the token.
        console.log("=-=-=-=-=-=-=-=-=-=-=-=");
        // console.log(req);
        console.log(req.headers);
        // console.log(req.headers.cookie);
        const token = req.cookies.jwt;
        console.log(token);
        // console.log(token);
        // console.log('token');
        const isBlackListed = await BlackList.findOne({ token });
        if(isBlackListed) {
            return res.status(400).json({
                status: 'fail',
                message: 'Please login first to see the content!'
            });
        }
        const tmp = (jwt.decode(token, process.env.JWT_SECRET));
        console.log('tmp');
        console.log(tmp);
        const id = tmp.id;
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