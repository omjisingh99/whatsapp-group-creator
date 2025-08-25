const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const fileUpload = require('express-fileupload');
const { Client, LocalAuth } = require('whatsapp-web.js');
const fs = require('fs');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static('public'));
app.use(fileUpload());

const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: { headless: true, args: ['--no-sandbox'] },
});

client.initialize();

client.on('qr', (qr) => {
  const imageDataUrl = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(qr)}&size=300x300`;
  io.emit('qr', imageDataUrl);
});

client.on('ready', () => {
  console.log('WhatsApp client is ready!');
  io.emit('ready');
});

client.on('authenticated', () => {
  console.log('WhatsApp authenticated');
  io.emit('authenticated');
});

client.on('auth_failure', (msg) => {
  console.error('AUTH FAILURE', msg);
  io.emit('auth_failure');
});

client.on('disconnected', () => {
  console.log('WhatsApp disconnected');
  io.emit('disconnected');
});

app.post('/api/group/create', async (req, res) => {
  try {
    const groupName = req.body.groupName;
    const file = req.files?.file;

    if (!groupName || !file) {
      return res.status(400).json({ error: 'Group name or file missing' });
    }

    const content = file.data.toString('utf8');
    const lines = content.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
    const numbers = lines.map(num => num.replace(/\D/g, '')).map(n => `${n}@c.us`);

    const response = await client.createGroup(groupName, numbers);
    res.json({ message: 'Group created successfully!', groupId: response.gid._serialized });
    io.emit('message', `Group "${groupName}" created with ${numbers.length} members.`);
  } catch (err) {
    console.error('Error creating group:', err);
    res.status(500).json({ error: 'Error creating group' });
  }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
