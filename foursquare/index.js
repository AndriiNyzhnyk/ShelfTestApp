const request = require('request');
const secret = require('./secret');
const json2csv = require('json2csv');
const fs = require('fs');

function result(err, res, body) {
    if (err) {
        console.error(err);
    } else {
        filterData(body);
    }
}

function filterData(body) {
    if(!body) return console.log('Not Data');

    let filterList = [];
    const data = JSON.parse(body);

    for(let i = 0; i < data.response.groups[0].items.length; i++) {
        let name = data.response.groups[0].items[i].venue.name;
        let city = data.response.groups[0].items[i].venue.location.city;
        let address = data.response.groups[0].items[i].venue.location.address;
        let lat = data.response.groups[0].items[i].venue.location.lat;
        let lng = data.response.groups[0].items[i].venue.location.lng;

        let item = {
            name,
            city,
            address,
            lat,
            lng
        };

        filterList.push(item);
    }
    createCsv(filterList);
}

function createCsv(list) {
    let fields = ['name', 'city', 'address', 'lat', 'lng'];
    let csv = json2csv({ data: list, fields: fields });

    fs.writeFile("file.csv", "sep =,\n", (err) => {
            if (err) throw err;
        });
    fs.appendFile('file.csv', csv, (err) => {
            if (err) throw err;
            console.log('file saved');
        });
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