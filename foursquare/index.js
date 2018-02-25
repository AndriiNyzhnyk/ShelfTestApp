const request = require('request');
const secret = require('./secret');
const json2csv = require('json2csv');

async function initQuery(res, query, lat, lng, radius) {
    let body = await setConfigQuery(query, lat, lng, radius);
    let filterList = await filterData(body);
    let data = await createCsv(filterList);
    let status = await sendDataToUser(res, data);

    if(status === 'ok') console.log('data send to client');
}

function setConfigQuery(query, lat, lng, radius) {
    return new Promise( (resolve, reject) => {
        let config = {
            url: 'https://api.foursquare.com/v2/venues/explore',
            method: 'GET',
            qs: {
                client_id: `${secret.clientId}`,
                client_secret: `${secret.clientSecret}`,
                ll: `${lat},${lng}`,
                query: `${query}`,
                radius: `${radius}`,
                v: '20170801',
                limit: 50
            }
        };

        request(config, (err, res, body) => {
            if (err) {
                reject(err);
            } else {
                resolve(body);
            }
        })
    });
}

function filterData(body) {
    return new Promise( (resolve, reject) => {
        if (!body) reject('not Data');

        let filterList = [];
        let data = JSON.parse(body);

        for(let i = 0; i < data.response.groups[0].items.length; i++) {
            let name = data.response.groups[0].items[i].venue.name || 'Немає інформації';
            let city = data.response.groups[0].items[i].venue.location.city || 'Немає інформації';
            let address = data.response.groups[0].items[i].venue.location.address || 'Немає інформації';
            let lat = data.response.groups[0].items[i].venue.location.lat || 'Немає інформації';
            let lng = data.response.groups[0].items[i].venue.location.lng || 'Немає інформації';

            let item = {
                name,
                city,
                address,
                lat,
                lng
            };

            filterList.push(item);
        }

        resolve(filterList);
    });
}

function createCsv(list) {
    return new Promise( (resolve, reject) => {
        let fields = ['name', 'city', 'address', 'lat', 'lng'];
        let csv = json2csv({data: list, fields: fields});

        resolve('sep =,\n' + csv);
    });
}

function sendDataToUser(res, data) {
    return new Promise( (resolve, reject) => {
        res.attachment('data.csv');
        res.send(data);

        resolve('ok');
    });
}

module.exports.initQuery = initQuery;