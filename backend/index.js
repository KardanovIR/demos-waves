const express = require('express');
const app = express();
const twitterRouter = require('./routes/twitter');
const cors = require('cors');
const path = require('path');

app.use(cors());
app.use('/api/v1/twitter', twitterRouter);

const staticPath = path.resolve(__dirname, '../build');
console.log(staticPath);
app.use(express.static(staticPath));

app.get('*', function (request, response) {
	response.sendFile(path.resolve(__dirname, staticPath + '/index.html'));
});


app.listen(80, () => console.log('Demo app listening on port 80!'));