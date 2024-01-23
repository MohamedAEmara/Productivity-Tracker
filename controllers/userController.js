const User = require("../models/User");
const Task = require("../models/Task");
const emailValidator = require('email-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { createAndSendToken, logoutUser } = require('./authController');
const { createAndSendVerificationEmail, createAndSendResetPassword } = require("../utils/sendVerification");
const { uploadToDrive, cloudinaryUpload } = require("../utils/uploadToDrive");
const dotenv = require('dotenv');
dotenv.config({path: "./config/.env"});

exports.signupUser = async (req, res) => {
    try {
        const newUser = {
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
            confirmPassword: req.body.password,
            isVerified: false,
            profilePic: req.body.profilePic || undefined
        };
        await User.create(newUser);
        console.log('CREATED......');
        createAndSendVerificationEmail(newUser.email);
        // res.send('ok, created successfully');
        res.render('new');
    } catch (err) {
        console.log(err);
        res.send('err');
    }
}



exports.loginUser = async (req, res) => {
    try {
        // Validate Email
        const email = req.body.email || req.body.username;
        const password = req.body.password;
        console.log(email);
        console.log(password);
        if(!email || !password) {
            res.status(400).json({
                error: 'fail',
                message: 'please enter your email & password.',
            })
        }

        let user;
        if(emailValidator.validate(email)) {
            // The input is email
            user = await User.findOne({ email: email });
        } else {
            // The input is username
            user = await User.findOne({ username: email });
        }
        if(!user) {
            return res.status(401).json({
                error: 'fail',
                message: 'email or password is not correct.',
            });
        }

        // Validate Password
        const correctPassword = await bcrypt.compare(password, user.password);
        if(correctPassword) {
            // Check if this user is verified.
            if(user.isVerified) {
                createAndSendToken(user, 200, res);
                res.status(200).send("You logged in successfully :)");
            } else {
                res.status(401).json({
                    error: 'fail',
                    message: 'verify your account first to login.'
                });
            }
        } else {
            res.status(401).json({
                error: 'fail',
                message: 'email or password is not correct.'
            });
        }

    } catch (err) {
        console.log(err);
    }
}


exports.uploadImage = async (req, res) => {
    if (req.file) {
        console.log(req.file);
        console.log('=-=-=-=--=-=-=-=-=');
        // uploadToDrive(req.file)
        const id = req.file.filename.split(".")[0]; 
        const url = await cloudinaryUpload(req.file.path, id);
        console.log(req.user);
        const user = await User.findOneAndUpdate({ _id: req.user }, { profilePic: url });
        console.log(user);
        res.send('File uploaded successfully!');
    } else {
        res.status(400).send('No file selected.');
    }
};



exports.logout = async (req, res) => {
    const id = req.user;
    const user = await User.findOne({_id: id});
    console.log('USERRRRRRRR');
    // console.log(req);
    console.log(user);
    logoutUser(user, 200, res);

    res.render('login');
}



exports.updatePassword = async (req, res) => {
    const id = req.user;
    const user = await User.findOne({_id: id});
    const oldPassword = req.body.oldPassword;
    const newPassword = req.body.confirmPassword;
    const currPassword = user.password;
    const correctPassword = await bcrypt.compare(oldPassword, currPassword);
    
    if(!correctPassword) {
        res.status(400).send({
            status: 'fail',
            message: 'You current password is not correct!!'
        });
    }

    await User.findOneAndUpdate({ _id: id }, { password: newPassword });
}



exports.updatePassword2 = async (req, res) => {
    try {
        const token = req.params.token;
        const tokenObj = jwt.verify(token, process.env.JWT_SECRET);
        let user = await User.findOne({ email: tokenObj.email });
        const newPassword = req.body.password;
        const hashedPassword = await bcrypt.hash(newPassword, parseInt(process.env.HASH_LENGTH));
        user = await User.findByIdAndUpdate( user._id , { password: hashedPassword });
        
        logoutUser(user, 200, res);
        res.render('login');
    } catch (err) {
        console.log(err);
        res.status(400).json({
            status: 'fail',
            message: 'Link expired. Please Re-Enter your mail to get another one!'
        });
    }
}



// exports.forgotPassword = async (req, res) => {
//     const id = req.user;
//     const user = await User.findOne({ _id: id });

//     createAndSendResetPassword(user.email);
//     res.render('new-pass');

// }


exports.forgotPassword = async (req, res) => {
    try {
        const email = req.body.email;
        createAndSendResetPassword(email);
        res.render('new-pass');
    } catch (err) {
        console.log(err);
        res.status(500).json({
            status: 'fail',
            message: 'Something went wront. Please try again!!'
        });
    }
}

exports.displayResetPassword = (req, res) => {
    const token = req.params.token;

    console.log('******************************************************');
    const tokenObj = jwt.decode(token, process.env.JWT_SECRET);
    // res.send(tokenObj);
    res.render('resetPassword', { token });
}


exports.displayDashboard = async (req, res) => {
    try {
        const id = req.user;
        const user = await User.findById(id);
        const tasks = await Task.find({ user: id });
        const completed = tasks.filter(task => {
            return task.completed === true
        });

        let completed_time = 0;

        for(let i=0; i<tasks.length; i++) {
            let tmp = tasks[i].time - tasks[i].remainingTime;
            console.log(tmp);
            if(typeof tmp === 'number' && tmp !== NaN) {
                console.log(`yes  ${tmp}`);
                completed_time += tmp;
            }
            console.log(completed_time)
        }
        console.log('Completed TTTTTTTTTTTTTTTTTime');
        console.log(completed_time);
        const hours = Math.floor(completed_time / 3600);
        const mins = Math.floor((completed_time - hours * 3600) / 60);
        const secs = Math.floor(completed_time - hours * 3600 - 60 * mins);
        
        res.render('dashboard', { hero: user, cnt_completed: completed.length, cnt_not: tasks.length - completed.length, hours, mins, secs });

    } catch (err) {
        console.log(err);
        res.status(500).json({
            status: 'fail',
            message: 'Something went wrong. Please try again later.'
        });
    }


}