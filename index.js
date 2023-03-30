const express = require('express');
const {ProsesNlp} = require('./nlp.js')
const app = express();
const port = 5111;
const point = '/api/v1/bots/qbotflutter'

app.get(point, (req, res) => {
  res.send('<h1>API is online</h1><br><p>untuk <strong>Flutter</strong></p>');
});

app.get(`${point}/input`, async (req, res) => {
    const {input} = req.query
    var jawab = await ProsesNlp(input)
    res.send(jawab)
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
