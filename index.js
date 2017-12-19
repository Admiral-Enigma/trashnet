const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const app = express()

app.get('/hello', (req, res) => {
  res.json({message: "Hello there"})
})

app.listen(3000, () => {
  console.log('Server running on port: '+3000);
})
