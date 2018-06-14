const WavesAPI = require('waves-api');


class Twitter {
	constructor(settings) {
		this.config = settings.config;
		this.Waves = WavesAPI.create(WavesAPI.TESTNET_CONFIG);
		this.centralAccount = this.Waves.Seed.fromExistingPhrase(this.config.CENTRAL_SEED);
	}
	
	faucet(address) {
		const wavesTransferData = {
			recipient: address,
			assetId: 'WAVES',
			amount: 100000000,
			feeAssetId: 'WAVES',
			fee: 100000,
			attachment: null,
			timestamp: Date.now()
		};
		
		const twitterCoinTransferData = {
			recipient: address,
			assetId: this.config.TWITTER_COIN_ID,
			amount: 10,
			feeAssetId: 'WAVES',
			fee: 100000,
			attachment: null,
			timestamp: Date.now()
		};
		
		return Promise.all([
			this.Waves.API.Node.v1.assets.transfer(wavesTransferData, this.centralAccount.keyPair),
			this.Waves.API.Node.v1.assets.transfer(twitterCoinTransferData, this.centralAccount.keyPair)
		]);
	}
	
}


module.exports = Twitter;