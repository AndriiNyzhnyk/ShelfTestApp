const request = require('request');
const json2csv = require('json2csv');
const crypto = require('crypto');

const { CLIENT_ID, CLIENT_SECRET  } = process.env;

let dataForUser = [];

setInterval( () => {
    autoDeleteItem();
}, 60000);


async function initQuery(query, lat, lng, radius, typeRes) {
    try {
        let body = await sendRequest(query, lat, lng, radius);
        let filterList = await filterData(body);


        if(typeRes === 'map') {
            return JSON.stringify(filterList);
        } else {
            let data = await createCsv(filterList);
            let id = await makeId();
            dataForUser.push({
                id,
                data,
                time: Date.now()
            });

            return 'ok_' + id;

        }


    } catch(err) {
        console.error(err);
    }
}

function sendRequest(query, lat, lng, radius) {
    return new Promise( (resolve, reject) => {
        let config = {
            url: 'https://api.foursquare.com/v2/venues/explore',
            method: 'GET',
            qs: {
                client_id: CLIENT_ID,
                client_secret: CLIENT_SECRET,
                ll: `${lat},${lng}`,
                query: `${query}`,
                radius: `${radius}`,
                v: '20180323',
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

function getUserData(id) {
    return new Promise( (resolve, reject) => {
        for (let i = 0; i < dataForUser.length; i++) {
            if(dataForUser[i].id === id) {
                resolve(dataForUser[i]);
                dataForUser.splice(i, 1);
                break;
            }
        }

    });
}

function makeId() {
    return new Promise( (resolve, reject) => {
        crypto.randomBytes(5, (ex, buf) => {
            if (ex) {
                reject(ex);
            }

            resolve(buf.toString('hex'));

        });
    });

}

function autoDeleteItem() {
    let timer = 3600 * 1000;
    for (let i = 0; i < dataForUser.length; i++) {
        if( (dataForUser[i].time + timer) > Date.now() ) {
            dataForUser.splice(i, 1);
        }
    }
}

module.exports.initQuery = initQuery;
module.exports.getUserData = getUserData;