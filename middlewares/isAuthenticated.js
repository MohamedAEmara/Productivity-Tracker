const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config('./config/.env');



exports.isAuthenticated = (req, res, next) => {
    try {
        // Check for the token.
        const token = req.cookies.jwt;
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