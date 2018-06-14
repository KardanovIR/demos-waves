const express = require('express');
const twitterRouter = express.Router();
let config = require('../../src/settings/constants');

const Twitter = require('../twitter/Twitter');
const twitter = new Twitter({ config: config });


// middleware that is specific to this router
twitterRouter.use(function (req, res, next) {
  next();
});

// define the home page route
twitterRouter.post('/faucet/:address', function (httpReq, httpRes) {
  twitter.faucet(httpReq.params.address)
    .then((wavesResponse) => {
      httpRes.json(wavesResponse);
    })
    .catch((wavesErr) => {
      console.error(wavesErr);
      httpRes.json(wavesErr);
    });
});


module.exports = twitterRouter;
