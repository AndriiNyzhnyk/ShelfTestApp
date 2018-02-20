const request = require('request');
const fs = require('fs');
const secret = require('./secret');

function result(err, res, body) {
    if (err) {
        console.error(err);
    } else {
        // console.log(body);
        fs.writeFile("data.json", body, (error) => {
            if(error) throw error;
            console.log("recording is complete");
        });
    }
}

module.exports.setConfigQuery = (query, lat, lng, radius) => {
    const config = {
        url: 'https://api.foursquare.com/v2/venues/explore',
        method: 'GET',
        qs: {
            client_id: `${secret.clientId}`,
                client_secret: `${secret.clientSecret}`,
                ll: `${lat},${lng}`,
                query: `${query}`,
                radius: `${radius}`,
                v: '20170801',
                limit: 10
        }
    };

    request(config, result);
};