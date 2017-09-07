# didactic-barnacle

This is a simple REST API that allows a user to download files to a remote host. This web service requires RabbitMQ and MySQL to correctly function.

### Setup

First edit the provided `.env` file filling in the necessary credentials for MySQL and RabbitMQ. Make sure these environmental variables are set before running `didactic-barnacle`.

#### To initialize, run:

    npm install
    npm run init

#### To start, run: 

    npm start

The web server instance is set to start on port `3001`

### REST API

GET: `/download/`: Returns the statuses of all downloads.

POST: `/download/`: Adds a download to the queue returning the download id. Post using content-type: `application/x-www-form-urlencoded` with the body containing the key `url` whose value is the url you wish to download.

GET: `download/[id]/status`: Returns the status of a specific download specified by id.

GET: `download/[id]/`: Returns the download if retrieved, otherwise redirects to `download/[id]/status`.

GET: `download/[id]?noHeader=true`: Returns the download if retrieved into the browser as raw text (instead of the content-type found when retrieving the download), otherwise redirects to `download/[id]/status`

### Future Improvements

 - More robust startup script ( ability to start multiple download workers)
 - File extensions support
 - Ability to check the progress of a download
 - Tests
