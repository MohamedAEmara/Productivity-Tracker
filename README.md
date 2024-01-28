# Productivity Tracker

## Overview

**Productivity Tracker** is a web application designed to help users manage their tasks efficiently by setting timers with customizable durations.

 It features real-time updates of the remaining time for each task, synchronization between the frontend and backend using **socket.io**, user image uploading capabilities using **Cloudinary**, and email verification and password reset functionalities using **Google's APIs**.

 [try it out](https://tracker-j3u9.onrender.com/)

## Features

- **Timer Management**: Users can create multiple timers, each with its own duration and name.
- **Real-Time Updates**: Socket.IO enables real-time synchronization between the frontend and backend, providing users with live updates of the remaining time for each task.
- **Image Uploading**: Users can upload their profile images using Cloudinary's image uploading service.
- **Email Verification**: Google's Nodemailer is used for sending verification codes to user email addresses, ensuring secure user registration.
- **Forgot Password**: Users can request password reset emails, allowing them to regain access to their accounts in case they forget their passwords.
- **Dashboard**: to track the completed & in-progress tasks and the total productivity time.

## Technologies Used

- **Node.js**: Backend JavaScript runtime environment.
- **MongoDB**: NoSQL database for storing user data and task information.
- **Socket.IO**: Real-time bidirectional event-based communication between the client and server.
- **Cloudinary**: Cloud-based image and video management service for image uploading.
- **Google Nodemailer**: Email sending service for user verification and password reset functionalities.
- **JWT**: for authentication & authorization.
- **Ejs**: as a template engine to render views.

## Installation

1. Clone the repository: `git clone https://github.com/MohamedAEmara/Productivity-Tracker.git`
2. Navigate to the project directory: `cd Productivity-Tracker`
3. Install dependencies: `npm install`
4. Set up environment variables:
   - Create a `.env` file in the root directory.
   - Add the following variables:
     ```
     PORT=<port_number>
     NODE_ENV=<development_or_production>

     DATABASE_URI=<your_database_uri>
     DATABASE_PASSWORD=<your_database_password>

     HASH_LENGTH=<hash_length_value>
     JWT_SECRET=<your_jwt_secret>
     JWT_EXPIRES_IN=<jwt_expires_in_value>

     MAIL=<your_email_address>
     PASS=<your_email_password>
     DEFAULT_IMG=<default_image_url>
     ERROR_IMG=<error_image_url>

     CLOUDINARY_API_SECRET=<your_cloudinary_api_secret>
     CLOUDINARY_API_KEY=<your_cloudinary_api_key>
     CLOUDINARY_CLOUD_NAME=<your_cloudinary_cloud_name>
     ```
5. Start the server: `npm start`
6. Access the application at `http://localhost:3000`

## Usage

1. Register a new account or log in if you already have one.
2. Verify your email address to ensure secure registration.
3. Set timers by providing the duration and name for each task.
4. View live updates of the remaining time for each task.
7. Edit or Delete tasks.
5. Upload profile images using the provided functionality.
6. Reset your password in case you forget it.


## Deploy

- The server is deployed on **Render** on this link: [`https://tracker-j3u9.onrender.com/`](https://tracker-j3u9.onrender.com/)
## Contributing

Contributions are welcome! Feel free to submit bug reports, feature requests, or pull requests to help improve the project.


## Contact

For any inquiries or support, please contact [Emara](mailto:mohamedemarax@gmail.com).
