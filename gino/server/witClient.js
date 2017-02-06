'use strict'

console.log('### In witClient');

const request = require('request');



/** from https://wit.ai/gxvigo/gino/settings
 * curl \ -H 'Authorization: Bearer 6PLRD3C6D5YD4DVWXN536OTZKVJUZU2R' \ 'https://api.wit.ai/message?v=20170125&q='
 */

module.exports = function witClient(token) {
    const ask = function (message, cb) {  // cb is passed by SlackClient to be invoked once wit call is complete
        console.log('### In witClient - ask: ' + JSON.stringify(message));


        // make a call to wit with message from Slack
        var options = {
            url: 'https://api.wit.ai/message?v=20170125&q=' + message,
            headers: {
                'Authorization': 'Bearer ' + token
            }
        };

        function callback(error, response, body) {
            if (error || response.statusCode != 200) {
                // var errorMsg = JSON.parse(error);
                // var responseMsg = JSON.parse(response);
                // var bodyMsg = JSON.parse(body);
                console.log('### In witClient - errorMsg: ' + error);
                console.log('### In witClient - responseMsg: ' + response);
                console.log('### In witClient - bodyMsg: ' + body);
                cb("witClient call failed. Err: " + error)
            } else {
                console.log('### In witClient - body: ' + body);
                cb(null, body); // call back SlackClient with wit response body
            }
        }
        request(options, callback);

    }
    return {
        ask: ask
    }
}
