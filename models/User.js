const mongoose = require('mongoose');
const emailValidator = require('email-validator');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
dotenv.config({ path: './config/.env' });


const isUserName = function(username) {
    const validLetters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_';

    let n = username.length;
    for(let i=0; i<n; i++) 
        if(!validLetters.includes(username[i])) 
            return false;
    
    return true;
}


const userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: [true, 'this username is taken'],
        required: [true, 'userName cannot be empty.'],
        validate: {
            validator: function(val) {
                const validLetters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_';
                let n = val.length;
                for(let i=0; i<n; i++) 
                    if(!validLetters.includes(val[i])) 
                        return false;
                return true;
            },
            // validator: isUserName(val),
            message: 'username can include only english letters, underscore, and numbers.'
        },
        minlength: [5, 'username cannot be less than 5 characters'],
        maxlength: [30, 'username cannot be more than 30 characters'],
    },
    email: {
        type: String,
        unique: [true, 'this email is already taken.'],
        required: [true, 'email cannot be empty.'],
        lowercase: true,
        validate: [emailValidator.validate, 'please enter a valid email.'],
    },
    password: {
        type: String,
        required: true,
        minlength: [8, 'password minlength is 8 characters'],
        maxlength: [50, 'password maxlenght is 50 characters'],
        select: false,  
    },
    confirmPassword: {
        type: String,
        required: true,
        validate: {
            validator: function(val) {
                return this.password === val;
            },
            message: 'passwordConfirm & password are not the same.'
        }
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    tasks: {
        // ids for tasks...
        // NOT IMPLEMENTED YET
    },
    profilePic: String
});



userSchema.pre('save', async function (next) {
    if(!this.isModified('password')) 
        return;

    this.password = await bcrypt.hash(this.password, parseInt(process.env.HASH_LENGTH));
    this.confirmPassword = undefined;
})



userSchema.pre(/^find/, async function (next) {
    this.select('+password');
})


const User = mongoose.model('User', userSchema);
module.exports = User;