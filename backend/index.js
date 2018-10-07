const express = require('express');
const app = express();
const twitterRouter = require('./routes/twitter');
const cors = require('cors');
const path = require('path');


app.use(cors());
app.use('/api/v1/twitter', twitterRouter);

const jsConsolePath = path.resolve(__dirname, '../console/build');
const contractsBuilderPath = path.resolve(__dirname, '../contractsBuilder');
const staticPath = path.resolve(__dirname, '../build');

app.use(express.static(staticPath));
app.use('/console', express.static(jsConsolePath));
app.use('/contractBuilder', express.static(contractsBuilderPath));

app.get('/console/index.html', function (request, response) {
    response.sendFile(path.resolve(__dirname, jsConsolePath + '/index.html'));
});

app.get('/console/waves-loaded.html', function (request, response) {
    response.sendFile(path.resolve(__dirname, jsConsolePath + '/waves-loaded.html'));
});


// app.get('/contractBuilder/*', function (request, response) {
//     response.sendFile(path.resolve(__dirname, contractsBuilderPath + '/index.html'));
// });

app.get('*', function (request, response) {
    response.sendFile(path.resolve(__dirname, staticPath + '/index.html'));
});


app.listen(80, () => console.log('Demo app listening on port 80!'));