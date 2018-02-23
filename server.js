// const serverless = require('serverless-http');
const express = require('express');
const bodyParser = require('body-parser');
const fourSquare = require('./foursquare');
const urlEncodedParser = bodyParser.urlencoded({extended: false});
const app = express();

app.set('port', process.env.PORT || 3000);
app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
    sendFile('/index.html', res);
});

app.get('/download', (req, res) => {
    res.download('file.csv');
});

app.post('/search', urlEncodedParser, (req, res) => {
    if(!req.body) return res.sendStatus(400);
    // console.log(req.body);
    const body = req.body;
    fourSquare.setConfigQuery(body.place, body.lat, body.lng, body.radius);
    res.send('ok');
});

// Обробник 404 помилки
app.use((req, res, next) => {
    res.status(404);
    res.type('text/plain');
    res.send('404');
});

// Обробник 500 помилки
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500);
    res.type('text/plain');
    res.send('500');
});

app.listen(app.get('port'), () => {
    console.log( 'Express запущенний на http://localhost:' +
        app.get('port') + '; нажміть Ctrl+C для завершення.' );
});

// module.exports.handler = serverless(app);