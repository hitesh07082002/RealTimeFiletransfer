const socket = io();

function register() {
    const username = document.getElementById('register-username').value;
    const password = document.getElementById('register-password').value;

    fetch('/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    })
    .then(response => response.json())
    .then(data => {
        if (data.message === 'User registered successfully') {
            alert(data.message);
        } else {
            alert('Error: ' + data.message);
        }
    });
}

function login() {
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;

    fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    })
    .then(response => response.json())
    .then(data => {
        if (data.token) {
            localStorage.setItem('token', data.token);
            document.getElementById('auth').style.display = 'none';
            document.getElementById('file-transfer').style.display = 'block';
            socket.auth = { token: data.token };
            socket.connect();
            loadReceivedFiles(username); // Load files available for download
        } else {
            alert('Error: ' + data.message);
        }
    });
}

function uploadFile() {
    const fileInput = document.getElementById('file-input');
    const recipientUsername = document.getElementById('recipient-username').value;
    const file = fileInput.files[0];
    const reader = new FileReader();

    reader.onload = function(event) {
        const fileData = event.target.result.split(',')[1];
        const fileName = file.name;
        socket.emit('file-upload', { fileName, fileData, recipientUsername });
    };

    reader.readAsDataURL(file);
}

function loadReceivedFiles(username) {
    fetch(`/files?username=${username}`)
    .then(response => response.json())
    .then(files => {
        const receivedFilesElement = document.getElementById('received-files');
        receivedFilesElement.innerHTML = '';
        files.forEach(file => {
            const downloadLink = document.createElement('a');
            downloadLink.href = file.filePath;
            downloadLink.download = file.fileName;
            downloadLink.innerText = `Download ${file.fileName}`;
            receivedFilesElement.appendChild(downloadLink);
        });
    });
}

socket.on('upload-status', (data) => {
    document.getElementById('status').innerText = data.message;
});
