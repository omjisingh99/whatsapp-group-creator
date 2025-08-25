const express = require('express');
const fs = require('fs');
const csv = require('csv-parser');
const client = require('../whatsapp');

const router = express.Router();

router.post('/create', async (req, res) => {
  const { groupName } = req.body;
  const file = req.files?.file;

  if (!groupName || !file) return res.status(400).send('Missing inputs.');

  const path = './uploads/' + file.name;
  await file.mv(path);

  const numbers = [];

  fs.createReadStream(path)
    .pipe(csv({ headers: false }))
    .on('data', row => {
      const raw = row[0].replace(/\D/g, '');
      if (raw.length >= 10) numbers.push(raw + '@c.us');
    })
    .on('end', async () => {
      try {
        const group = await client.createGroup(groupName, numbers);
        res.send('✅ Group created: ' + group.gid.user);
      } catch (err) {
        console.error(err);
        res.status(500).send('❌ Failed to create group.');
      }
    });
});

module.exports = router;
