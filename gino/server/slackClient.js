// This module used Real-Time messaging API (rtm) provided by Slack sdk
// rtm is used in a separate module and not in run.js so that the websocket communication
// is started just when rtm is called and not as soon as run is executed

'use strict'

console.log('### In slackClient');
const RtmClient = require('@slack/client').RtmClient;
const CLIENT_EVENTS = require('@slack/client').CLIENT_EVENTS;
const RTM_EVENTS = require('@slack/client').RTM_EVENTS;

let rtm = null;
let nlp = null; // nlp (natural language processing) is an abstracted name for witClient

// helper functions to handle authenticated event
function handleOnAuthenticated(rtmStartData) {
    console.log(`### In slackClient - Logged in as '${rtmStartData.self.name}' of team ${rtmStartData.team.name}, but not yet connected to a channel`);
}
function addAuthenticatedHandler(rtm, handler) {
    rtm.on(CLIENT_EVENTS.RTM.AUTHENTICATED, handler)
}

// handler to incoming messages (sent bot). The bot must join a channel to receive messages 
function onMessageHandler(message){
    console.log("### In slackClient - message for bot: " + JSON.stringify(message));

    // you need to wait for the client to fully connect before you can send messages
    // rtm.sendMessage("Kia Ora!", "D3UNNDMDW"); // private message to gino
    // rtm.sendMessage("Kia Ora!", "C1EU0EPAS"); // general channel
    rtm.sendMessage("Kia Ora!", "C3VC7CNKT"); // gino_training_room channel
    nlp.ask('nlp ask test from onMessageHandler');    
}

module.exports.init = function (botToken, logLevel, nlpClient){   // nlpClient is witClient passed by run.js
    // console.log('### In slackClient - slackAPIToken: ' + botToken);
    nlp = nlpClient;
    rtm = new RtmClient(botToken,  {logLevel: logLevel});
    addAuthenticatedHandler(rtm, handleOnAuthenticated);
    rtm.on(CLIENT_EVENTS.RTM.UNABLE_TO_RTM_START, () => console.log(`### In slackClient - Issues connecting to Slack
        review console log. Most likely the token is expired. Checkt the current valide token:
        ttps://ibmnzswgpublic.slack.com/services/132156114534?updated=1s`));  // handle slack client connection issues
    rtm.on(RTM_EVENTS.MESSAGE, onMessageHandler);
    return rtm;
}

// this makes possible to subscribe the event outside the module
module.exports.addAuthenticatedHandler = addAuthenticatedHandler;




