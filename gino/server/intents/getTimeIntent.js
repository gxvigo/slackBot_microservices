'use strict'

/* This module(s) are used to haldle the complexity of many possible intents.
Each modul will handle a specific intent.
*/

module.exports.process = function process(intentData, cb){

    if(intentData.intent[0].value !== 'getTime'){
        return cb(new Error(`### In timeIntent - Expected getTime intent, got ${intentData.intent[0].value}`))
    }

    if(!intentData.location) return cb(new Error(`### In timeIntent - Missing location in intent`);)

    return (cb(false, `I don't know yet the time in ${intentData.location[0].value}`))
}