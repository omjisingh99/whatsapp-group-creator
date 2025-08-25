const socket = io();
const qrImg = document.getElementById('qr');

socket.on('qr', data => {
  qrImg.src = data;
});

socket.on('ready', () => {
  qrImg.src = '';
  alert('✅ WhatsApp is ready!');
});

document.getElementById('groupForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);

  const res = await fetch('/api/group/create', {
    method: 'POST',
    body: formData
  });

  const txt = await res.text();
  document.getElementById('response').innerText = txt;
});
