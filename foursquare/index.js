const request = require('request');
const secret = require('./secret');

const config = {
    url: 'https://api.foursquare.com/v2/venues/explore',
    method: 'GET',
    qs: {
        client_id: `${secret.clientId}`,
            client_secret: `${secret.clientSecret}`,
            ll: '40.7243,-74.0018',
            query: 'coffee',
            v: '20170801',
            limit: 1
    }
};

request(config, (err, res, body) => {
if (err) {
        console.error(err);
    } else {
        console.log(body);
   }
});
