$(document).ready( function() {
    $('#search').submit( function(e) {
            e.preventDefault();
            let data = $(this).serialize();
            // let searchPlace = $('#place').val();
            // data.plase = searchPlace + '';
            // console.log(searchPlace);
            // console.log(data);
            $.ajax({
                    type: "POST",
                    url: "/search",
                    data: data
            });
        });
});