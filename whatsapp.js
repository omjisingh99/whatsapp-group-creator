const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode');

const client = new Client({
  authStrategy: new LocalAuth({ dataPath: './session' }),
  puppeteer: {
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  },
});

client.on('qr', async qr => {
  const image = await qrcode.toDataURL(qr);
  global.io.emit('qr', image);
});

client.on('ready', () => {
  console.log('✅ WhatsApp is ready!');
  global.io.emit('ready', 'WhatsApp ready');
});

client.on('authenticated', () => {
  console.log('🔐 Authenticated');
});

client.on('auth_failure', msg => {
  console.error('❌ Auth failed:', msg);
});

client.initialize();

module.exports = client;
