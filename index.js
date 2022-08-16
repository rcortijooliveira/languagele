const express = require('express')
const app = express()
const port = 4000
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/Languagele' ,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
);

app.get('/', (req, res) => {
  res.send('Hello World!')
})



app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})


