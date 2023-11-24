const multer = require('multer');
const path = require('path');
const jwt = require('jsonwebtoken');

const storage = multer.diskStorage({
    destination: 'uploads/',
    filename: function (req, file, cb) {
        // You can customize the filename here
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const originalExtension = path.extname(file.originalname);
        const token = req.cookies.jwt;

        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                return res.status(401).json({ error: 'Unauthorized - Invalid token' });
            }
            console.log(decoded);
            req.user = decoded.id;
            
        });

        const modifiedFilename = req.user + originalExtension;
        cb(null, modifiedFilename);
    }
});

const upload = multer({ storage: storage });

const singleImageUpload = upload.single('image');

module.exports = {
    singleImageUpload
};