'use strict';
const request = require('request');
const fs = require('fs');
const path = require('path')

const db = require('./modules/db');
const queue = require('./modules/queue');

const downloadsFolder = process.env.DOWNLOAD_FOLDER;

let downloadError = async function(msg, error) {
    await db.table('downloads')
    .where('id', data.id)
    .update({
        status: 'error'
    })

    console.error(`Error while downloading ID:${data.id}`)
    console.error(error);    
    
    let channel = await queue.getChannel();
    channel.ack(msg)
}

let downloadComplete = async function(msg, data, contentType) {
    await db.table('downloads')
    .where('id', data.id)
    .update({
        status: 'success',
        content_type: contentType,
        file: data.id
    });

    console.log(`Finished downloading ID:${data.id}`)    

    let channel = await queue.getChannel();    
    channel.ack(msg)    
}

let ingestDownload = function (msg) {
    let data = JSON.parse(msg.content.toString());
    let savePath = path.join(downloadsFolder, String(data.id))

    console.log(`Downloading ID:${data.id} to ${savePath}`)    
    
    let contentType;
    
    request(data.url)
    .on('response', (response) => {

        contentType = response.headers['content-type'];
    }).on('error', (error) => {

        downloadError(msg, error);
    }).on('end', () => {

        downloadComplete(msg, data, contentType);
    }).pipe(fs.createWriteStream(savePath))
}

console.log("Download Worker Started");
queue.getChannel().then((ch) => {

    ch.assertQueue(queue.queues.downloads, { durable: true }).then(() => {
        ch.prefetch(1);
        ch.consume(queue.queues.downloads, ingestDownload);          
    });
});
