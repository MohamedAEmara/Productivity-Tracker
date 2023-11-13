const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config({ path: './config/.env' });
const nodemailer = require('nodemailer');
const secretKey = process.env.JWT_SECRET;

const createToken = (email) => {
    const payload = {
        email
    };

    const token = jwt.sign(payload, secretKey, { expiresIn: '10m' }); // You can adjust the expiration time as needed

    return token;
}


let mailTransporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.MAIL,
        pass: process.env.PASS,
    }
});




exports.createAndSendVerificationEmail = (email) => {
    
    let html = `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to Productivity Tracker</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                background-color: #f4f4f4;
                color: #333;
                margin: 0;
                padding: 0;
            }
            .container {
                max-width: 600px;
                margin: 20px auto;
                background-color: #fff;
                padding: 20px;
                border-radius: 5px;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            }
            h1 {
                color: #007BFF;
            }
            p {
                line-height: 1.6;
            }
            .button {
                display: inline-block;
                padding: 10px 20px;
                background-color: #007BFF;
                color: #fff;
                text-decoration: none;
                border-radius: 3px;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>Welcome to Productivity Tracker!</h1>
            <p>Thank you for registering with us. We're excited to have you on board.</p>
            <p>Please click the button below to verify your email address:</p>
            <a href="http://127.0.0.1:3000/users/new/<TOKEN>" class="button">Verify Email</a>
            <p>If you didn't register on Productivity Tracker, you can ignore this email.</p>
        </div>
    </body>
    </html>
    `;

    const token = createToken(email);

    html = html.replace('<TOKEN>', token);
    console.log(html);
    
    let mailOptions = {
        from: "Productivity Tracker",
        to: email,
        subject: "Verification Mail",
        html: html
    };
  
    mailTransporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return console.error('Error sending email:', error);
      }
      console.log('Email sent:', info.response);
    });
}
