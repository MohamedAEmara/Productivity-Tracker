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
app.use('/users', userRoutes);





const port = process.env.PORT || 8080;
 
app.listen(port, async () => {
    try {
        await connectDB();
        console.log(`App is listenning on port ${port}`)
        
    } catch (err) {
        console.log(err);
    }
})