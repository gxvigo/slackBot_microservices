'use strict'  // use ES6 strict mode

console.log('### In run');

const config = require('../config');
const service = require('../server/service');
const slackClient = require('../server/slackClient');
const witClient = require('../server/witClient')(config.witAPIToken); // require and initialize witClient

let server = null;


// start Real-Time Messaging Slack client
const slackBotToken = config.slackAPIToken; // Token expires often, check current valid token at: https://ibmnzswgpublic.slack.com/services/132156114534?updated=1
let slackLogLevel = config.slackLogLevel;  // 'debug' for more details

const rtm = slackClient.init(slackBotToken, slackLogLevel, witClient); // witClient is passed along to be used in SlackClient
rtm.start();

// start server only if there's a connection to Slack, subscribing the Slack authenticated event
slackClient.addAuthenticatedHandler(rtm, () => {   // ()=>{}  new syntax for function in ES6
 
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