require('dotenv').config();
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const fileUpload = require('express-fileupload');
const groupRoutes = require('./routes/group');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);
global.io = io;

app.use(express.static('public'));
app.use(fileUpload());
app.use('/api/group', groupRoutes);

io.on('connection', socket => {
  console.log('🟢 New socket connected:', socket.id);
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
