const ampq = require('amqplib');
const ampqHost = process.env.RABBITMQ;
let channel;

module.exports = {
    getChannel: async function () {
        if (!channel) {
            await ampq.connect(ampqHost).then(async (conn) => {
                await conn.createChannel().then((chan) => {
                    channel = chan;
                });
            });
        } 
        return new Promise(function(resolve) {
            resolve(channel);
        });
    },
    queues: {downloads: 'Downloads'}
}