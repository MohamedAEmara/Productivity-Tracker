const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const User = require('../models/User');
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

        const tmp = (jwt.decode(token, process.env.JWT_SECRET));
        console.log(tmp);
        console.log(Date.now());
        if(tmp.exp <= Math.floor(Date.now() / 1000)) {
            res.status(400).json({
                status: 'fail',
                message: 'Please login first to see the content!'
            });
        }
        console.log('tmp');
        console.log(tmp);
        const id = tmp.id;
        req.user = id;
        req.hero = await User.findById(id);
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