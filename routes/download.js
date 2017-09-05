'use strict';

var Express = require('express');
var Download = Express();

// Get the statuses of all Downloads
Download.get('/', function(req, res) {
    
    res.send({status: pending, id: })
});

// Get the status of a specific Download
Download.get('/:id', function (req, res) {
    req.params.id;
});

// Add a Download
Download.post('/', function(req, res) {

});

export default Download;