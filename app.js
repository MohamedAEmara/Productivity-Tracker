const express = require('express');
const app = express();
const dotenv = require('dotenv');
dotenv.config({ path: './config/.env' });
const cookieParser = require('cookie-parser');
const ejs = require('ejs');
app.use(express.json());
app.use(cookieParser());
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));

// app.use('/public', express.static(path.join(`${__dirname}/public`, 'static')));
app.set('view engine', 'ejs');


const connectDB = require('./db/connectDB');


const userRoutes = require('./routes/userRoutes');
const { singleImageUpload } = require('./utils/upload');
const { uploadImage } = require('./controllers/userController');
app.use('/users', userRoutes);

const path = require('path');
const multer = require('multer');
const storage = multer.diskStorage({
    destination: 'uploads/',
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const { isAuthorized } = require('./controllers/authController.js');
// route for uploading single image (locally)..
app.use('/upload', isAuthorized, singleImageUpload, uploadImage);
app.use('/test', (req, res) => res.render('test'));

// app.use('/test', isAuthorized);

const port = process.env.PORT || 8080;
 
app.listen(port, async () => {
    try {
        await connectDB();
        console.log(`App is listenning on port ${port}`)
        
    } catch (err) {
        console.log(err);
    }
})