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
app.use(express.static('public'));
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));

app.set('view engine', 'ejs');

const connectDB = require('./db/connectDB.js');

const userRoutes = require('./routes/userRoutes.js');
const { singleImageUpload } = require('./utils/upload.js');
const { uploadImage } = require('./controllers/userController.js');
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
const Task = require('./models/Task.js');
const { showProfile } = require('./controllers/taskController.js');
const { isAuthenticated } = require('./middlewares/isAuthenticated.js');

// Route for uploading a single image (locally)..
app.post('/upload', isAuthorized, singleImageUpload, uploadImage);
// app.use('/test', (req, res) => res.render('timer', { time: 3600, remaining: 10 }));
app.use('/test', isAuthenticated,  showProfile);

// Set up Socket.io events
io.on('connection', (socket) => {
  console.log(`A user connected: ${socket.id}`);

  socket.on('second', async(id) => {
    console.log('1 seconds passed!!');
    // update the remaining of the user with this id..
    console.log(id);
    console.log(typeof id);
    const strId = id.toString();
    console.log(typeof strId);
    // await User.findOneAndUpdate({ _id: strId }, { remainingTime: this.remainingTime-1});
    await Task.findByIdAndUpdate(id.id, { $inc: { remainingTime: -1 }});
  })
  // Listen for disconnect event
  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
    
  });

  
});


app.get('/haha', (req, res) => {
  res.render('enter-your-mail');
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