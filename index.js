const express = require('express');
const {checkKey} = require('./apikeycheck')
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
    const {input, client, apikey} = req.query

    //cek apikey
    if(checkKey(client, apikey)){
      var jawab = await ProsesNlp(input)
      res.send(jawab)
    }
    else res.send('<h1>invalid client or API key</h1>')
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
