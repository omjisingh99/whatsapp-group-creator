const socket = io();

socket.on('qr', (src) => {
  document.getElementById('qr').src = src;
  document.getElementById('status').innerText = 'Scan the QR code with your WhatsApp app';
});

socket.on('ready', () => {
  document.getElementById('status').innerText = 'WhatsApp connected ✅';
});

socket.on('authenticated', () => {
  document.getElementById('status').innerText = 'WhatsApp authenticated ✅';
});

socket.on('message', (msg) => {
  document.getElementById('status').innerText = msg;
});

document.getElementById('groupForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const groupName = document.getElementById('groupName').value;
  const file = document.getElementById('file').files[0];

  const formData = new FormData();
  formData.append('groupName', groupName);
  formData.append('file', file);

  document.getElementById('status').innerText = 'Creating group...';

  const res = await fetch('/api/group/create', {
    method: 'POST',
    body: formData,
  });

  const data = await res.json();
  document.getElementById('status').innerText = data.message || data.error;
});
