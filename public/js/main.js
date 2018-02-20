$(document).ready( () => {
    $('#search').submit( (e) => {
        e.preventDefault();
        const place = $('#place').val();
        const radiusItems = $('.itemR');
        let radius;
        for (let i = 0; i < radiusItems.length; i++) {
            if (radiusItems[i].type === 'radio' && radiusItems[i].checked) {
                radius = radiusItems[i].value;
                break;
            }
        }
        init(place, radius);
    });

    async function init(place, radius) {
        try {
            const position = await getPosition();
            const data = await concatValue(position, place, radius);
            sendData(data);
        } catch(e) {
            console.error(e);
        }
    }

    function getPosition() {
        return new Promise(resolve => {
            navigator.geolocation.getCurrentPosition( position => {
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;
                resolve({lat,lng});
            });
        });
    }

    function concatValue(pos, place, radius) {
        return new Promise(resolve => {
            let lat = pos.lat;
            let lng = pos.lng;
            const data = {
                place,
                radius,
                lat,
                lng
            };
            console.log(data);
            resolve(data);
        });
    }

    function sendData(data) {
        $.ajax({
            type: "POST",
            url: "/search",
            data: data,
            success: function(text) {
                setTimeout(() => {
                    let url = "/download";
                    $( location ).attr("href", url);
                }, 1500);

            }
        });
    }
});