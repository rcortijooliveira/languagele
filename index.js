const express = require('express')
const app = new express()
const path = require('path')

const port = 4000
const mongoose = require('mongoose');


app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use('/css', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/css')))
app.use('/js', express.static(path.join(__dirname, 'node_modules/jquery/dist')))
app.use('/umd', express.static(path.join(__dirname, 'node_modules/@popperjs/core/dist/umd')))
app.use('/js', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/js')))

mongoose.connect('mongodb://localhost:27017/Languagele' ,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
);

const mainController = require('./controllers/main');
app.get('/', mainController);

const wordInfoController = require('./controllers/wordinfo');
app.get("/dayword", wordInfoController);

const solutionController = require('./controllers/solution');
app.get('/solutionCheck', solutionController);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})


