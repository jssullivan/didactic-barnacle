'use strict';

const express = require('express');
const fs = require('fs');

const db = require('../modules/db');
const queue = require('../modules/queue')

const downloadsFolder = process.env.DOWNLOAD_FOLDER;

let download = express();

// Get the status of all Downloads
download.get('/', function(req, res) {
    db.table('downloads').select('id', 'status', 'url').then((data) => {

        res.json({status: 'success', data: data});
    }).catch((error) => {

        res.status(500).json({status: 'error', error: error.message});
    });
});

// Get the status of a specific Download
download.get('/:id/status', function (req, res) {
    let id = req.params.id;

    db.table('downloads')
    .select('id', 'status', 'url', 'creation_date')
    .where('id', id)
    .then((data) => {
        
        if (data.length > 0) {
            res.json(Object.assign({status: 'success'}, data[0]));            
        } else {
            res.status(400).json({status: 'error', error: 'ID Not Found'});
        }
    }).catch((error) => {

        res.status(500).json({status: 'error', error: error.message});
    });
});

// Get the raw file with the proper content header, 
// if the file's status is isn't 'success', then redirect to the status page.
// use get parameter noHeader=true to display raw text
download.get('/:id', function (req, res) {
    let id = req.params.id;
    
    db.table('downloads')
    .select('id', 'status', 'url', 'file')
    .where('id', id)
    .then((data) => {

        if (data.length == 0) {
            res.status(400).json({status: 'error', error: 'ID Not Found'});            
        } else if (data[0].status != 'success') {
            res.redirect(req.originalUrl + '/status')
        } else {
            
            if(!req.query.noHeader) {
                res.set('Content-Type', data[0].content_type);
            } else {
                res.set('Content-Type', 'text/plain'); 
                res.set('Content-disposition', 'inline');
            }

            res.sendFile(data[0].file, {root: downloadsFolder})                       
        }
    }).catch((error) => {

        res.status(500).json({status: 'error', error: error.message});
    });
});

// Adds a Download
download.post('/', function(req, res) {
    let url = req.body.url;
    if (!url) {
        
        res.status(400).json({status: 'error', error: 'No URL sent'})
        return;
    }

    db.table('downloads')
    .insert({url, status: 'pending'})
    .returning('id')
    .then((id) => {
        id = id[0];
        let msg = {
            url,
            id
        };
        
        return queue.getChannel().then((ch) => {

            return ch.assertQueue(queue.queues.downloads, { durable: true }).then(() => {
                ch.sendToQueue(queue.queues.downloads, new Buffer(JSON.stringify(msg)));
                
                res.json({status:'success', id});           
            });
        });
    }).catch(error => 
       
        res.status(500).json({status: 'error', error})
    );

});

module.exports = download;