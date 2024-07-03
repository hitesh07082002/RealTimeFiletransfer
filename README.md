# File Transfer Application

This is a simple file transfer application built using Node.js, Express, and Socket.IO. It allows users to register, login, send files to other registered users, and receive files sent to them.

## Getting Started

To get a local copy up and running follow these simple steps.

### Prerequisites

Make sure you have Node.js and npm (Node Package Manager) installed.



### Installation

 ###Clone the repository
   
   git clone https://github.com/hitesh07082002/realTimeFileTransfer.git

Navigate into the project directory

cd realTimeFileTransfer


**Install dependencies**

npm install


**Usage**

Start the server

node server.js

The server will start running at http://localhost:3000.

Open your web browser and go to http://localhost:3000.

Register as a new user and then log in using your credentials.

Once logged in, you will see two main functionalities:

**Send File**: Upload a file by specifying the recipient's username.

**Received Files**: View and download files sent to you by other users.

### **Usage**

## Registration and Login
Register a new user with a unique username and password.
Login with your registered username and password to access the file transfer functionalities.

## Sending Files
After logging in, go to the "Send File" section.

Enter the recipient's username and choose a file to upload.

Click "Upload" to send the file to the recipient.

Receiving Files
After logging in, go to the "Received Files" section.

You will see a list of files that have been sent to you.

Click on the download link next to each file to download it to your local machine.

### **Features**
Secure user authentication using JWT (JSON Web Tokens).

Real-time file transfer using Socket.IO for efficient data transmission.

Responsive UI/UX for easy file selection and transfer across devices.

Progress indicators and status updates during file upload.

File download capability for recipients regardless of online status during upload.
