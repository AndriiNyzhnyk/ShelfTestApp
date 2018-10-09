$(document).ready( () => {
    let position;


    $('#search').submit( (e) => {
        e.preventDefault();
        let place = $('#place').val();
        let radiusItems = $('.itemR');
        let listTypeResponse = $('.typeResponse');

        let radius;
        for (let i = 0; i < radiusItems.length; i++) {
            if (radiusItems[i].type === 'radio' && radiusItems[i].checked) {
                radius = radiusItems[i].value;
                break;
            }
        }
        
        let typeResponse;
        for (let i = 0; i < listTypeResponse.length; i++) {
            if (listTypeResponse[i].type === 'radio' && listTypeResponse[i].checked) {
                typeResponse = listTypeResponse[i].value;
                break;
            }
        }

        initRequest(place, radius, typeResponse);

    });

    async function initRequest(place, radius, typeRes) {
        try {
            position = await getPosition();
            let data = await concatValue(position, place, radius, typeRes);
            sendData(data);
        } catch(e) {
            console.error(e);
        }
    }

    function getPosition() {
        return new Promise(resolve => {
            navigator.geolocation.getCurrentPosition( position => {
                let lat = position.coords.latitude;
                let lng = position.coords.longitude;
                resolve({lat,lng});
            });
        });
    }

    function concatValue(pos, place, radius, typeRes) {
        return new Promise(resolve => {
            let lat = pos.lat;
            let lng = pos.lng;
            let data = {
                place,
                radius,
                lat,
                lng,
                typeRes
            };
            // console.log(data);
            resolve(data);
        });
    }

    function sendData(data) {
        $.ajax({
            type: "POST",
            url: "/search",
            data: data,
            success: function(dataRes) {
                if(data.typeRes === 'map') {
                    let data = JSON.parse(dataRes);

                    initMap(position, data);

                } else {
                    // console.log(data);
                    let arr = dataRes.split('_');
                    if(arr[0] === 'ok' && arr[1] !== '') {
                        let url = '/download/' + arr[1] ;
                        $( location ).attr("href", url);
                    }
                }

            }
        });
    }

    async function initMap(position, data) {
        try {
            let map = await createMap(position.lat, position.lng);


            for(let i = 0; i < data.length; i++) {
                await addMarker(map, data[i].name, data[i].lat, data[i].lng);
            }

            await addMarker(map, 'You', position.lat, position.lng, true);

            $('#mapid').show();

        } catch(e) {
            console.error(e);
        }
    }


    function createMap(lat, lng) {
        return new Promise( resolve => {
            let myMap = L.map('mapid').setView([lat, lng], 15);
            L.tileLayer('https://a.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(myMap);
            resolve(myMap);
        });
    }

    function addMarker(myMap, userName, lat, lng, boss) {
        return new Promise(resolve => {
            let marker;

            if(boss === true) {
                marker = new L.marker([lat,lng])
                    .addTo(myMap)
                    .bindPopup(userName)
                    .openPopup();
            } else {
                marker = new L.marker([lat,lng])
                    .addTo(myMap)
                    .bindPopup(userName);
            }

            resolve(marker);
        });
    }

});