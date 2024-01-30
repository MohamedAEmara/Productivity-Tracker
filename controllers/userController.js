const User = require("../models/User");
const Task = require("../models/Task");
const emailValidator = require('email-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { createAndSendToken, logoutUser } = require('./authController');
const { createAndSendVerificationEmail, createAndSendResetPassword } = require("../utils/sendVerification");
const { cloudinaryUpload } = require("../utils/uploadToDrive");
const dotenv = require('dotenv');
dotenv.config({path: "./.env"});

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
            return res.render('error', { error_msg: 'Please enter your email & password' });
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
            return res.render('error', { error_msg: 'email or password is not correct.' });
        }

        // Validate Password
        const correctPassword = await bcrypt.compare(password, user.password);
        if(correctPassword) {
            // Check if this user is verified.
            if(user.isVerified) {
                createAndSendToken(user, 200, res);
                const tasks = await Task.find({ user: user._id });
                
                let taskObjs = [];
            tasks.forEach(task => {
                let taskObject = task.toObject();
                
                let time = taskObject.time;
                taskObject.hours = Math.floor(time / 3600);
                time -= taskObject.hours * 3600;
                taskObject.mins = Math.floor(time / 60);
                time -= taskObject.mins * 60;
                taskObject.secs = time;
                
                let remaining = taskObject.remainingTime;
                taskObject.rem_hours = Math.floor(remaining / 3600);
                remaining -= taskObject.rem_hours * 3600;
                taskObject.rem_mins = Math.floor(remaining / 60);
                remaining -= taskObject.rem_mins * 60;
                taskObject.rem_secs = remaining;

                if(taskObject.hours < 10) {
                    taskObject.hours = `0${taskObject.hours}`;
                }
                if(taskObject.mins < 10) {
                    taskObject.mins = `0${taskObject.mins}`;
                }
                if(taskObject.secs < 10) {
                    taskObject.secs = `0${taskObject.secs}`;
                }
                if(taskObject.rem_hours < 10) {
                    taskObject.rem_hours = `0${taskObject.rem_hours}`;
                }
                if(taskObject.rem_mins < 10) {
                    taskObject.rem_mins = `0${taskObject.rem_mins}`;
                }
                if(taskObject.rem_secs < 10) {
                    taskObject.rem_secs = `0${taskObject.rem_secs}`;
                }
                
                taskObjs.push(taskObject);
            })  
            
            res.render('tasks', { tasks: taskObjs, hero: user, page: 'All Tasks' });

            } else {

                return res.render('error', { error_msg: 'Verify your email first to login.' });
            }
        } else {
            return res.render('error', { error_msg: 'email or password is not correct.' });
        }

    } catch (err) {
        console.log(err);
    }
}


exports.uploadImage = async (req, res) => {
    try {
        if (req.file) {
            console.log(req.file);
            console.log('=-=-=-=--=-=-=-=-=');
            // uploadToDrive(req.file)
            const id = req.file.filename.split(".")[0]; 
            const url = await cloudinaryUpload(req.file.path, req.user);
            console.log(req.user);
            await User.findOneAndUpdate({ _id: req.user }, { profilePic: url });
            const user = await User.findOne({ _id: id });
            console.log(user);
            // res.send('File uploaded successfully!');
            res.render('profile', { hero: user });
        } else {
            return res.render('error', { error_msg: 'No file selected' });
        }
    } catch (err) {
        console.log(err);
        return res.render('error', { error_msg: 'Something went wrong. Please try again later' });

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
    try {
        const id = req.user;
        const user = await User.findOne({_id: id});
        const oldPassword = req.body.oldPassword;
        const newPassword = req.body.confirmPassword;
        const currPassword = user.password;
        console.log(oldPassword);
        console.log(newPassword);
        console.log(currPassword);
        const correctPassword = await bcrypt.compare(oldPassword, currPassword);
        
        if(!correctPassword) {
            return res.render('error', { error_msg: 'Password is not correct' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, parseInt(process.env.HASH_LENGTH));
    
        await User.findOneAndUpdate({ _id: id }, { password: hashedPassword });
        logoutUser(user, 200, res);

        res.render('login');

    } catch (err) {
        console.log(err);
        return res.render('error', { error_msg: 'Something went wrong. Please try again later.' });

    }
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
        return res.render('error', { error_msg: 'Link expired. Please Re-Enter your mail to get another one!' });

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
        return res.render('error', { error_msg: 'Something went wrong. Please try again later.' });

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
        return res.render('error', { error_msg: 'Something went wrong. Please try again later.' });

    }


}


exports.updateUser = async (req, res) => {
    try {
        const id = req.user;
        const username = req.body.username;
        if(!username) {
            return res.render('error', { error_msg: 'No username attached.' });
        }

        await User.findByIdAndUpdate(id, { username });
        const user = await User.findById(id);
        const tasks = await Task.find({ user: id });
        res.render('tasks', { hero: user, tasks, page: 'All Tasks' });
    } catch (err) {
        console.log(err);
        return res.render('error', { error_msg: 'Something went wrong. Please try again later.' });

    }
}