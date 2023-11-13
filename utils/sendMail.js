const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config({ path:'./config/.env'});

const html = `
    <h1>Hello, there</h1>
    <h2>Send by nodemailer</h2>
`;


let mailTransporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.MAIL,
        pass: process.env.PASS,
    }
});


let details = {
    from: process.env.MAIL,
    to: "medoemara104@gmail.com",
    subject: "Verification Mail",
    html: html
};


mailTransporter.sendMail(details, (err) => {
    if(err) {
        console.log(err);
    } else {
        console.log("mail sent successfully :)");
    }
});
