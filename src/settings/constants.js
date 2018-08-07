let config = require('./config.json');

const centralAddressSeed = process.env.TWITTER_SEED;

let _config;
const WavesAPI = require('@waves/waves-api');
const Waves = WavesAPI.create(WavesAPI.TESTNET_CONFIG);

if (centralAddressSeed) {
	_config = {
		...config,
		centralSeed: centralAddressSeed,
		centralAddress: Waves.Seed.fromExistingPhrase(centralAddressSeed).address,
	}
} else {
	_config = config;
}

console.log(_config);

const constants = {
	TESTNET_NODES_BASE_URL: 'https://testnode1.wavesnodes.com',
	TWITTER_COIN_ID: _config.twitterCoinId,
	CENTRAL_ADDRESS: _config.centralAddress,
	CENTRAL_SEED: _config.centralSeed
};

module.exports = constants;