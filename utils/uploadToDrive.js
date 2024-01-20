const fs = require('fs');
const { google } = require('googleapis');
const apikeys = require('../config/apikey.json');
const User = require('../models/User');

const SCOPE = ["https://www.googleapis.com/auth/drive"];

async function authorize() {
    const jwtClient = new google.auth.JWT(
        apikeys.client_email,
        null,
        apikeys.private_key,
        SCOPE
    );

    await jwtClient.authorize();

    return jwtClient;
}

const uploadFile = async (authClient, filePath) => {
    return new Promise((resolve, reject) => {
        const drive = google.drive({ version: 'v3', auth: authClient });

        let fileMetaData = {
            name: "",
            parents: ["1w2Y9J-nUaenBsK5amw4DoWxeHN4fN-UF"]
        };
        console.log('file path: ' + filePath);
        drive.files.create({
            resource: fileMetaData,
            media: {
                body: fs.createReadStream(filePath),
            },
            fields: 'id,webViewLink' // Request the webViewLink field
        }, (err, file) => {
            if (err) {
                console.log(err);
                reject(err);
            } else {
                resolve(file);
            }
        });
    });
};


exports.uploadToDrive = async (filePath, id) => {
    // const filePath = './ff.jpeg'; // replace with the desired file path
    authorize()
        .then(authClient => uploadFile(authClient, filePath))
        .then(async file => {
            console.log('File uploaded successfully. WebViewLink:', file.data.webViewLink)
            await User.findByIdAndUpdate(id, {profilePic: file.data.webViewLink});

            // >>>>>>>>>>>>>>>>>>>>>>>  ToDo  <<<<<<<<<<<<<<<<<<<<<<<<
            // Delete image locally after uploading to Drive
            fs.unlink(filePath, (err) => {
                if(err) {
                    console.log('Error deleting file: ' + filePath);
                } else {
                    console.log('File deleted successfully from uploads file');
                }
            })
        }) 
        .catch(err => console.error('Error uploading file:', err));
}



const cloudinary = require('cloudinary');
const dotenv = require('dotenv');
dotenv.config({ path: './.env'});

console.log('Before');
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});
console.log('After');
console.log(process.env.CLOUDINARY_API_KEY);


exports.cloudinaryUpload = async(file, id) => {
    const img = await cloudinary.uploader.upload(file, {
        public_id: id
    },
    function(error, result) {console.log(result); });
    console.log(img);
    return img.url;
} 