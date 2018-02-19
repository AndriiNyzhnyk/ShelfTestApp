$(document).ready( function() {
    $('#search').submit( function(e) {
            e.preventDefault();
            let data = $(this).serialize();
        if(data === {} ) {
            alert('Заповніть всі поля ! !');
        } else {
            $.ajax({
                    type: "POST",
                    url: "/search",
                    data: data
            });
        }
    });
});