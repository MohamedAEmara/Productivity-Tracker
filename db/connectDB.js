const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './.env' });


let connectionString = process.env.DATABASE_URI;
connectionString = connectionString.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

const connectDB = async () => {
    try {
        const connection = await mongoose.connect(connectionString, {
            useNewUrlParser: true,
            useFindAndModify: false,
            useCreateIndex: true,
            useUnifiedTopology: true,
        });

        console.log('DB connected successfully 🌎');
    } catch (err) {
        console.log(err);
        process.exit(1);
    } 
}


module.exports = connectDB;