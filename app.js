const express = require('express');
const app = express();
const httpServer = require('http').createServer(app);
const io = require('socket.io')(httpServer);
const morgan = require('morgan');

const dotenv = require('dotenv');
dotenv.config({ path: './config/.env' });
const cookieParser = require('cookie-parser');
const ejs = require('ejs');

const methodOverride = require("method-override");
app.use(express.urlencoded({ extended: true })); // Body parsing middleware

app.use(
  methodOverride(function (req, res) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
      let method = req.body._method
      delete req.body._method
      return method
    }
}))



app.use(express.json());
app.use(cookieParser());

// Morgan
const customLogFormat = ':method :url';
app.use(morgan(customLogFormat));

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));

app.set('view engine', 'ejs');


const connectDB = require('./db/connectDB');

const userRoutes = require('./routes/userRoutes');
const { singleImageUpload } = require('./utils/upload');
const { uploadImage } = require('./controllers/userController');
app.use('/users', userRoutes);


const taskRoutes = require('./routes/taskRoutes.js');
app.use('/tasks', taskRoutes);


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
app.use('/test', (req, res) => res.render('timer', { time: 3600, remaining: 10 }));


io.on('connection', (socket) => {
    console.log(`A user connected: ${socket.id}`);

    socket.on('two-sec', () => {
        console.log('2 seconds passed!!!');

    })


})
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


