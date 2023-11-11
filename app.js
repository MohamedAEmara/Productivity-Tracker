const express = require('express');
const app = express();
const dotenv = require('dotenv');
dotenv.config({ path: './config/.env' });

const connectDB = require('./db/connectDB');














// process.on('warning', (warning) => {
//     // if (warning.name === 'DeprecationWarning' && warning.message.includes('The URL')) {
//       // Ignore the deprecation warning related to the connection string
//       return;
//     // }
//     console.warn('warning');
//   });


const port = process.env.PORT || 8080;
// const connectionString = process.env.DATABASE_URI;
app.listen(port, async () => {
    try {
        await connectDB();
        console.log(`App is listenning on port ${port}`)
        
    } catch (err) {
        console.log(err);
    }
})