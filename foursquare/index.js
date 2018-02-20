const request = require('request');
const secret = require('./secret');

function result(err, res, body) {
    if (err) {
        console.error(err);
    } else {
        filterData(body);
    }
}

function filterData(body) {
    if(!body) return console.log('Not Data');

    const data = JSON.parse(body);
    for(let i = 0; i < data.response.groups[0].items.length; i++) {
        console.log(data.response.groups[0].items[i].venue.name);
        console.log(data.response.groups[0].items[i].venue.location.city);
        console.log(data.response.groups[0].items[i].venue.location.address);
        console.log(data.response.groups[0].items[i].venue.location.lat, data.response.groups[0].items[i].venue.location.lng);
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
                radius: `${radius + 80000}`,
                v: '20170801',
                limit: 20
        }
    };

    request(config, result);
};