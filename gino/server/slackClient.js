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
function onMessageHandler(message) {
    console.log("### In slackClient - message for bot: " + JSON.stringify(message));

    if (message.text.toLowerCase().includes('gino') || message.channel == 'D3UNNDMDW') { //handle message only if it contains bot name (gino) or it's a private message for gino(channel: D3UNNDMDW)
        nlp.ask(message.text, (err, res) => {
            // console.log("### In slackClient - nlp.ask res: " + res);
            const resObj = JSON.parse(res);

            if (err) {
                // console.log("### In slackClient - nlp.ask error:  " + err);
                return
            }

            try {
                if (!resObj.entities.intent || !resObj.entities.intent[0] || !resObj.entities.intent[0].value) {
                    throw new Error("### In slackClient - nlp.ask - Could not extract itent.");
                }
                const intent = require('./intents/' + resObj.entities.intent[0].value + 'Intent'); // it requires the module based on the intent
                intent.process(res, function (error, response) {  // all intents have the same process method name 'process'
                    if (error) {
                        console.log("### In slackClient - require intent error: " + error.message);
                        return;
                    }

                    return rtm.sendMessage(response, message.channel);
                })
            } catch (err) {
                console.log("### In slackClient - require intent catch err: " + err);
                console.log("### In slackClient - require intent catch res: " + res);
                console.log("Sorry, I don't know what are you talking about", message.chanel);
            }

            if (!resObj.entities.intent) {
                return rtm.sendMessage(`Sorry, I didn't understand, what you said is not clear to me (nlp intent/entity)`, message.channel); // return exit the function
            } else if (resObj.entities.intent[0].value == "getTime" && resObj.entities.location) {
                return rtm.sendMessage(`Sorry, I didn't understand all, I am still learning... your intent is ${resObj.entities.intent[0].value} in ${resObj.entities.location[0].value} but I can't get the time yet`, message.channel); // gino_training_room channel
            } else {
                // handle all the unknown entities, training for nlp is required
                console.log("### In slackClient - nlp.ask res: " + res);
                return rtm.sendMessage(`Sorry, I didn't understand all, I am still learning... your intent is unknown to me`, message.channel); // gino_training_room channel

            }

            /* TO-DO IMPLEMENT CHECK THAT MESSAGE IS UNDERSTOOD
            *  test for intents and entities
            */

            // you need to wait for the client to fully connect before you can send messages
            // rtm.sendMessage("Kia Ora!", "D3UNNDMDW"); // private message to gino
            // rtm.sendMessage("Kia Ora!", "C1EU0EPAS"); // general channel
            console.log("### In slackClient - res from witClient: " + resObj._text);
            return rtm.sendMessage(`Sorry, I didn't understand all, I am still learning... but I got your intent is ${resObj.entities.intent[0].value} in ${resObj.entities.location[0].value}`, message.channel); // gino_training_room channel
        });   // send the message to witClient 
    }

}

module.exports.init = function (botToken, logLevel, nlpClient) {   // nlpClient is witClient passed by run.js
    // console.log('### In slackClient - slackAPIToken: ' + botToken);
    nlp = nlpClient;
    rtm = new RtmClient(botToken, { logLevel: logLevel });
    addAuthenticatedHandler(rtm, handleOnAuthenticated);
    rtm.on(CLIENT_EVENTS.RTM.UNABLE_TO_RTM_START, () => console.log(`### In slackClient - Issues connecting to Slack
        review console log. Most likely the token is expired. Checkt the current valide token:
        ttps://ibmnzswgpublic.slack.com/services/132156114534?updated=1s`));  // handle slack client connection issues
    rtm.on(RTM_EVENTS.MESSAGE, onMessageHandler);
    return rtm;
}

// this makes possible to subscribe the event outside the module
module.exports.addAuthenticatedHandler = addAuthenticatedHandler;




