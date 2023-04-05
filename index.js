const express = require('express');
const {ProsesNlp} = require('./nlp.js')
const app = express();
const port = 5111;
const point = '/api/v1/bots/islambot'

/*
    cek di sini
    http://localhost:5111/api/v1/bots/islambot/input?input=hai 
*/

app.get('/', (req, res) => {
  res.send('<h1>API is online</h1><br><p>http://localhost:5111/api/v1/bots/islambot/input?input=hai</p>');
});

app.get(point, (req, res) => {
  res.send('<h1>API <u>QBot</u> is online</h1><br><p>untuk <strong>Flutter</strong></p>');
});

app.get(`${point}/input`, async (req, res) => {
    const {input} = req.query
    var jawab = await ProsesNlp(input)
    res.send(jawab)
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
