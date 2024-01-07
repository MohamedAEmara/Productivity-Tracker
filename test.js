const express = require('express');
const app = express();
const httpServer = require('http').createServer(app); // Create an HTTP server
const io = require('socket.io')(httpServer); // Integrate Socket.io with the HTTP server

const dotenv = require('dotenv');
dotenv.config({ path: './config/.env' });
const cookieParser = require('cookie-parser');
const ejs = require('ejs');

const methodOverride = require('method-override');
app.use(express.urlencoded({ extended: true }));
app.use(
  methodOverride(function (req, res) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
      let method = req.body._method;
      delete req.body._method;
      return method;
    }
  })
);

app.use(express.json());
app.use(cookieParser());
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
  },
});

const { isAuthorized } = require('./controllers/authController.js');

// Route for uploading a single image (locally)..
app.use('/upload', isAuthorized, singleImageUpload, uploadImage);
// app.use('/test', (req, res) => res.render('timer', { time: 3600, remaining: 10 }));
app.use('/test', (req, res) => res.render('socket'));

// Set up Socket.io events
io.on('connection', (socket) => {
  console.log(`A user connected: ${socket.id}`);

  // Send a message to the client every 5 seconds
  const interval = setInterval(() => {
    socket.emit('message', 'Server: Hello from server!');
  }, 5000);

  socket.on('two-sec', () => {
    console.log('2 seconds passed!!');
  })
  // Listen for disconnect event
  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
    clearInterval(interval); // Stop sending messages on disconnect
  });
});

const port = process.env.PORT || 8080;

httpServer.listen(port, async () => {
  try {
    await connectDB();
    console.log(`App is listening on port ${port}`);
  } catch (err) {
    console.log(err);
  }
});