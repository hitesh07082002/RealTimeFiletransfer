const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const users = {}; // This will store user data. In a real application, use a database.
const uploadedFiles = {}; // Store uploaded files information

const secretKey = 'your_secret_key'; // Use a strong secret key in a real application.

app.post('/register', (req, res) => {
    const { username, password } = req.body;
    if (users[username]) {
        return res.status(400).json({ message: 'User already exists' });
    }
    const hashedPassword = bcrypt.hashSync(password, 8);
    users[username] = { password: hashedPassword };
    res.status(201).json({ message: 'User registered successfully' });
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const user = users[username];
    if (!user || !bcrypt.compareSync(password, user.password)) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign({ username }, secretKey, { expiresIn: '1h' });
    res.json({ token });
});

io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    try {
        const decoded = jwt.verify(token, secretKey);
        socket.username = decoded.username;
        next();
    } catch (err) {
        next(new Error('Authentication error'));
    }
});

io.on('connection', (socket) => {
    console.log(`User ${socket.username} connected`);

    socket.on('file-upload', (data) => {
        const { fileName, fileData, recipientUsername } = data;
        const filePath = path.join(__dirname, 'uploads', fileName);
        fs.writeFileSync(filePath, fileData, 'base64');

        // Save file information
        uploadedFiles[fileName] = {
            fileName,
            filePath: `/uploads/${fileName}`,
            senderUsername: socket.username,
            recipientUsername
        };

        // Notify sender of successful upload
        socket.emit('upload-status', { message: `File ${fileName} uploaded successfully` });
        console.log(`File uploaded: ${fileName}`);
    });

    socket.on('disconnect', () => {
        console.log(`User ${socket.username} disconnected`);
    });
});

app.get('/files', (req, res) => {
    const { username } = req.query;
    const files = Object.values(uploadedFiles).filter(file => file.recipientUsername === username);
    res.json(files);
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
