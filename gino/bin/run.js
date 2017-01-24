'use strict'  // use ES6 strict mode

console.log('### In run');

const service = require('../server/service');
const slackClient = require('../server/slackClient');
const config = require('../config');

let server = null;

// start Real-Time Messaging Slack client
const slackBotToken = config.slackAPIToken;
let slackLogLevel = 'verbose';  // 'debug' for more details
console.log('### In run - slackBotToken: ' + slackBotToken);
const rtm = slackClient.init(slackBotToken, slackLogLevel);
rtm.start();

// start server only if there's a connection to Slack, subscribing the Slack authenticated event
slackClient.addAuthenticatedHandler(rtm, () => {

    server = service.listen(3000, function () {
        console.log("Application listening in port 3000");  // 'pro' logging modules are: node-bunyan or winston
    })

    // Another option to execute statements is creating an event listener
    server.on('listening', function () {
        console.log(`[event] Application listening on ${server.address().port} in ${service.get('env')} mode`);
        // by default 'service.get('env')' return 'development' to set to a different value run:
        // export NODE_ENV=production
        // this is use to make the application dynamic, based on where the code is deployed (if... then...)
    });
});