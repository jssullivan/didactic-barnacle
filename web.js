'use strict';

const express = require('express');
const bodyParser = require('body-parser');

let app = express();
let download = require('./routes/download');

// body-parser middleware is required for post requests
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/download', download);

app.listen(3001, function () {
    console.log('Web Server Started');
});