'use strict';

const fs = require('fs');
const db = require('./modules/db.js');

const downloadsFolder = process.env.DOWNLOAD_FOLDER;

(async () => {

    console.log('Creating Tables in the Database');
    let dbPromise = db.schema.createTable('downloads', (table) => {
        table.increments();
        table.enu('status', ['pending', 'success', 'error']);
        table.text('url'),
        table.text('file'),
        table.text('content_type')
        table.timestamp('creation_date');
    });

    console.log(`Creating Downloads Folder at ${downloadsFolder}`);
    if (!fs.existsSync(downloadsFolder)) {
        fs.mkdirSync(downloadsFolder);
    } else {
        console.error(`${downloadsFolder} already exists, collisions in file names will result in data loss`);        
    }

    // Make sure we have created the Downloads Table before exiting the script (Making the Folder is run synchonrously)
    dbPromise.then(() => {
        console.log('Initialization Complete');        
        process.exit();        
    }) 
})();