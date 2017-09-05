'use strict';

const { Client } = require('pg');
const Fs = require('fs');
const Db = new Client();

const Downloads = process.env.DOWNLOAD_FOLDER; 

(async () => {
    await Db.connect();

    console.log("Running init queries on the postgres Database");
    let queries = [
        "CREATE TYPE status AS ENUM ('pending', 'successful', 'error');",
        "CREATE TABLE Downloads( \
            ID serial PRIMARY KEY, \
            STATUS status NOT NULL, \
            FILE TEXT \
            );",
    ]

    try {
        for (let query of queries ) {
            await Db.query(query);
        };
    } catch (ex) {
        console.error("Error in initiliazing the Database")
        console.error(ex);
    }

    console.log(`Creating Downloads Folder at ${Downloads}`);
    if (!Fs.existsSync(Downloads)) {
        Fs.mkdirSync(Downloads);
    } else {
        console.error(`${Downloads} already exists, collisions in file names will result in data loss`);        
    }

    let connectionEnd = Db.end();    
    console.log("Initialization Complete");
})();