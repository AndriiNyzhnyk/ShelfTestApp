// const serverless = require('serverless-http');
const express = require('express');
const bodyParser = require('body-parser');
const fourSquare = require('./foursquare');
const urlEncodedParser = bodyParser.urlencoded({extended: false});
const app = express();

app.set('port', process.env.PORT || 3000);
app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
    res.sendFile('/index.html');
});

app.get('/download', (req, res) => {
    res.attachment('data.csv');
    res.send(fourSquare.getUserData());
});

app.post('/search', urlEncodedParser, (req, res) => {
    if(!req.body) return res.sendStatus(400);

    let body = req.body;
    fourSquare.initQuery(body.place, body.lat, body.lng, body.radius)
        .then(value => {
            res.send(value);
        });
});

// Обробник 404 помилки
app.use((req, res, next) => {
    res.status(404);
    res.sendFile(__dirname + '/public/p404.html');
});

// Обробник 500 помилки
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500);
    res.sendFile(__dirname + '/public/p500.html');
});

app.listen(app.get('port'), () => {
    console.log( 'Express запущенний на http://localhost:' +
        app.get('port') + '; нажміть Ctrl+C для завершення.' );
});

// module.exports.handler = serverless(app);