const express = require("express");
const app = express();

app.set('port', process.env.PORT || 3000);
app.use(express.static(__dirname + "/public"));

app.get("/", (req, res) => {
    sendFile("/index.html", res);
});

// Обробник 404 помилки
app.use((req, res, next) => {
    res.status(404);
    res.type("text/plain");
    res.send("404");
});

// Обробник 505 помилки
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500);
    res.type("text/plain");
    res.send("500");
});

app.listen(app.get('port'), () => {
    console.log( 'Express запущенний на http://localhost:' +
        app.get('port') + '; нажміть Ctrl+C для завершення.' );
});