const express = require('express');
const { checkKey } = require('./apikeycheck')
const { ProsesNlp } = require('./nlp.js');
const { selfLog } = require('./fungsi');
const app = express();
const port = 5111;
const point = '/api/v1/bots/islambot'
app.use(express.static('public'));

/*
    cek di sini
    http://localhost:5111/api/v1/bots/islambot/input?input=hai
    http://localhost:5111/api/v1/bots/islambot/share?surat=1&ayat=1
*/

app.get(point, (req, res) => {
  res.send('<h1>API <u>IslamBot</u> is online</h1><br><p>untuk <strong>Flutter</strong></p>');
});

// menampilkan share ayat
app.get(`${point}/share/:surat/:ayat`, (req, res) => {
  const surat = req.params.surat;
  const ayat = req.params.ayat;
  const { client, apikey } = req.query

  // cek apikey
  if (checkKey(client, apikey)) {
    surat == "" || ayat == "" 
    ? res.send({ "answer": "Mohon masukkan surat dan nomor ayat dengan tepat.", "actions":[{"action":"Ayat acak"},{"action":"Share acak"},{"action":"Bantuan"}] }) 
    : surat == undefined || ayat == undefined 
    ? res.send({ "answer": "Mohon masukkan surat dan nomor ayat dengan tepat.", "actions":[{"action":"Ayat acak"},{"action":"Share acak"},{"action":"Bantuan"}] }) 
    : res.sendFile(`D:/Projects/Javascript/API-QBot-flutter/gambar/surah/${surat}/${ayat}.jpg`);
  }
  else res.send('<h1>invalid client or API key</h1>')
});

// input pakai teks
app.get(`${point}/input`, async (req, res) => {
  const { input, client, apikey } = req.query

  //cek apikey
  if (checkKey(client, apikey)) {
    var jawab = await ProsesNlp(input)
    res.send(jawab)
  }
  else res.send('<h1>invalid client or API key</h1>')
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
