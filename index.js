const express = require('express');
const {ProsesNlp} = require('./nlp.js')
const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send('<h1>API is online</h1><br><p>untuk <strong>Flutter</strong></p>');
});

app.get('/qbot', async (req, res) => {
    const {input} = req.query
    var jawab = await ProsesNlp(input)
    res.send(jawab)
});

app.listen(port, () => {
  console.log(`Server listening at http://0.0.0.0:${port}`);
});
