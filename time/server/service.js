'use strict'   // use ES6 strict mode

const express = require('express');
const request = require('request');
const moment = require('moment');
const serviceConfig = require('../config');
const service = express();

// Get latitude and longitude of a given location from Google API
service.get('/service/:location', (req, res, next) => {
    // res.json({ result: req.params.location })

    // make a call to Google Geocoding API
    let options = {
        url: 'https://maps.googleapis.com/maps/api/geocode/json?address=' + req.params.location + '&key=' + serviceConfig.googleGeocodingApiKey
    };

    function callback(error, response, body) {
        let bodyObj = JSON.parse(body);
        if (error || response.statusCode != 200) {
            // var errorMsg = JSON.parse(error);
            // var responseMsg = JSON.parse(response);
            // var bodyMsg = JSON.parse(body);
            console.log('### In service - geocode - errorMsg: ' + error);
            console.log('### In service - geocode  - responseMsg: ' + response);
            console.log('### In service - geocode  - bodyMsg: ' + body);
            return response.status(500);
        } else {
            console.log('### In service  - geocode - body: ' + body);
            console.log('### In service  - geocode - location: ' + JSON.stringify(bodyObj.results[0].geometry.location));
            const timestamp = +moment().format('X'); // return current time in timestamp in unix format ('X') as a number (+)            
            const location = bodyObj.results[0].geometry.location;

            let options = {
                url: 'https://maps.googleapis.com/maps/api/timezone/json?location= ' + location.lat + ',' + location.lng + '&timestamp=' + timestamp + '&key=' + serviceConfig.googleTimezoneApiKey
            };
            function callbackTimeZone(error, response, body) {
                console.log('### In services - timezone - callbackTimeZone');
                let bodyObj = JSON.parse(body);
                if (error || response.statusCode !== 200) {
                    console.log('### In services - timezone - errorMsg: ' + error);
                    console.log('### In services - timezone - responseMsg: ' + response);
                    console.log('### In services - timezone - bodyMsg: ' + body);
                    return response.status(500);
                } else {
                    // console.log('### In services - timezone - bodyMsg: ' + body);
                    const timeString = moment.unix(timestamp + bodyObj.dstOffset + bodyObj.rawOffset).utc().format('dddd, MMMM Do YYYY, h.mm.ss a'); // Calculate time in give location adding timzone offset (google) and formatting with moment
                    res.json(timeString);
                }
            };
            request(options, callbackTimeZone);
        }
    }

    request(options, callback);

})

module.exports = service;

