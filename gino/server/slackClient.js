// This module used Real-Time messaging API (rtm) provided by Slack sdk
// rtm is used in a separate module and not in run.js so that the websocket communication
// is started just when rtm is called and not as soon as run is executed

'use strict'

console.log('### In slackClient');
const RtmClient = require('@slack/client').RtmClient;
const CLIENT_EVENTS = require('@slack/client').CLIENT_EVENTS;

// helper functions to handle authenticated event
function handleOnAuthenticated(rtmStartData) {
    console.log(`### In slackClient - Logged in as ${rtmStartData.self.name} of team ${rtmStartData.team.name}, but not yet connected to a channel`);
}

function addAuthenticatedHandler(rtm, handler) {
    rtm.on(CLIENT_EVENTS.RTM.AUTHENTICATED, handler)
}



// const config = require('../config');
// const botToken = config.slackAPIToken;
// console.log('### In slackClient - slackAPIToken: ' + botToken);

module.exports.init = function (botToken, logLevel){
    console.log('### In slackClient - slackAPIToken: ' + botToken);
    const rtm = new RtmClient(botToken,  {logLevel: logLevel});
    addAuthenticatedHandler(rtm, handleOnAuthenticated);
    return rtm;
}

// this makes possible to subscribe the event outside the module
module.exports.addAuthenticatedHandler = addAuthenticatedHandler;




