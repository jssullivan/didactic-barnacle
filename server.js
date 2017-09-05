'use script';

let Express = require('express');
let App = Express();

let Download = require('./routes/download');

App.use('/download', Download);