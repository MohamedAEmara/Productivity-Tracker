const express = require('express');
const app = express();
const dotenv = require('dotenv');
dotenv.config({ path: './config/.env' });
const cookieParser = require('cookie-parser');

app.use(express.json());
app.use(cookieParser());

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