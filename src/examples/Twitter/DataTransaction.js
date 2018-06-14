import constants from "../../settings/constants";

const axlsign = require('./vendor/axlsign').default;
const base58 = require('./vendor/base58').default;
const sec = require('./vendor/secure-random').default;

const DATA_ENTRY_TYPES = {
	INTEGER: 'integer',
	BOOLEAN: 'boolean',
	BINARY_ARRAY: 'binary',
	STRING: 'string',
};

function buildTransactionSignature(dataBytes, privateKey) {
	if (!dataBytes || !(dataBytes instanceof Uint8Array)) {
		throw new Error('Missing or invalid data');
	}
	
	if (!privateKey || typeof privateKey !== 'string') {
		throw new Error('Missing or invalid private key');
	}
	
	const privateKeyBytes = Uint8Array.from(base58.decode(privateKey));
	
	const signature = axlsign.sign(privateKeyBytes, dataBytes, sec.randomUint8Array(64));
	return base58.encode(signature);
	
}

const byteProcessors = {
	byte: function (value) {
		if (typeof value !== 'number') throw new Error('You should pass a number to Byte constructor');
		if (value < 0 || value > 255) throw new Error('Byte value must fit between 0 and 255');
		return [value];
	},
	bool: function (value) {
		if (typeof value !== 'boolean') {
			throw new Error('Boolean input is expected');
		}
		
		return value ? [1] : [0]
		
	},
	long: function (input) {
		if (typeof input !== 'number') {
			throw new Error('Numeric input is expected');
		}
		
		const bytes = new Array(7);
		for (let k = 7; k >= 0; k--) {
			bytes[k] = input & (255);
			input = input / 256;
		}
		
		return bytes;
		
	},
	short: function (input) {
		if (typeof input !== 'number') {
			throw new Error('Numeric input is expected');
		}
		
		const bytes = new Array(1);
		for (let k = 1; k >= 0; k--) {
			bytes[k] = input & (255);
			input = input / 256;
		}
		
		return bytes;
	},
	string: function (str) {
		let utf8 = [];
		for (let i = 0; i < str.length; i++) {
			let charcode = str.charCodeAt(i);
			if (charcode < 0x80) utf8.push(charcode);
			else if (charcode < 0x800) {
				utf8.push(0xc0 | (charcode >> 6),
					0x80 | (charcode & 0x3f));
			}
			else if (charcode < 0xd800 || charcode >= 0xe000) {
				utf8.push(0xe0 | (charcode >> 12),
					0x80 | ((charcode >> 6) & 0x3f),
					0x80 | (charcode & 0x3f));
			}
			// surrogate pair
			else {
				i++;
				// UTF-16 encodes 0x10000-0x10FFFF by
				// subtracting 0x10000 and splitting the
				// 20 bits of 0x0-0xFFFFF into two halves
				charcode = 0x10000 + (((charcode & 0x3ff) << 10)
					| (str.charCodeAt(i) & 0x3ff));
				utf8.push(0xf0 | (charcode >> 18),
					0x80 | ((charcode >> 12) & 0x3f),
					0x80 | ((charcode >> 6) & 0x3f),
					0x80 | (charcode & 0x3f));
			}
		}
		return utf8;
		
	}
};

function getSigDataBytes(tx) {
	const getTypeByte = (type) => {
		switch (type) {
			case DATA_ENTRY_TYPES.INTEGER: {
				return 0;
			}
			case DATA_ENTRY_TYPES.BOOLEAN: {
				return 1;
			}
			case DATA_ENTRY_TYPES.BINARY_ARRAY: {
				return 2;
			}
			case DATA_ENTRY_TYPES.STRING: {
				return 3;
			}
		}
	};
	
	const getValueBytes = (type, value) => {
		switch (type) {
			case DATA_ENTRY_TYPES.INTEGER: {
				return byteProcessors.long(value);
			}
			case DATA_ENTRY_TYPES.BOOLEAN: {
				return byteProcessors.bool(!!value);
			}
			case DATA_ENTRY_TYPES.BINARY_ARRAY: {
				const valBytes = base58.decode(value);
				return byteProcessors.short(valBytes.length).concat(Array.from(valBytes));
			}
			case DATA_ENTRY_TYPES.STRING: {
				const valBytes = byteProcessors.string(value);
				return byteProcessors.short(valBytes.length).concat(Array.from(valBytes));
			}
		}
	};
	
	
	let sigBytes = [12]; //tx type
	sigBytes = sigBytes.concat(byteProcessors.byte(1)); //version
	sigBytes = sigBytes.concat(base58.decode(tx.senderPublicKey)); //public key
	sigBytes = sigBytes.concat(byteProcessors.short(tx.data.length)); // number of data entries
	
	
	tx.data.forEach((object) => {
		let keyLength = byteProcessors.short(object.key.length);
		let key = byteProcessors.string(object.key);
		let bytes = keyLength.concat(key,
			getTypeByte(object.type),
			getValueBytes(object.type, object.value));
		
		sigBytes = sigBytes.concat(bytes);
	});
	
	
	sigBytes = sigBytes.concat(byteProcessors.long(tx.timestamp));
	sigBytes = sigBytes.concat(byteProcessors.long(tx.fee));
	
	return sigBytes;
	
}

class DataTransaction {
	
	static get DATA_ENTRY_TYPES() {
		return DATA_ENTRY_TYPES
	};
	
	calculateFee(tx) {
		let fee = parseInt(tx.feePerKb) || 100000;
		let dataSizeInBytes = 52 + 10000;
		tx.data.forEach((object) => {
			dataSizeInBytes += 2;
			dataSizeInBytes += object.key.length;
			console.log(object.value, byteProcessors.string(object.value).length);
			dataSizeInBytes += byteProcessors.string(object.value).length;
			dataSizeInBytes += 1; //type size
			dataSizeInBytes += 2; //value size bytes
		});
		const feeSize = Math.ceil(dataSizeInBytes / 1024 * fee);
		return !feeSize || feeSize < 100000 ? 100000 : feeSize;
	}
	
	constructor(tx, keyPair) {
		tx.fee = this.calculateFee(tx);
		const sigBytesArray = getSigDataBytes(tx);
		const sigData = Uint8Array.from(sigBytesArray);
		const signature = buildTransactionSignature(sigData, keyPair.privateKey);
		this.tx = {
			version: 1,
			...tx,
			type: 12,
			proofs: [signature],
			signature: signature
		}
	}
	
	static stringToByteArray(str) {
		return byteProcessors.string(str);
	}
	
	static byteArrayToString(data) {
		let str = '';
		for (let i = 0; i < data.length; ++i)
			str += String.fromCharCode(data[i]);
		
		str = unescape(decodeURIComponent(str));
		return str;
	}
	
	static stringToBase58(str) {
		const byteArray = this.stringToByteArray(str);
		return base58.encode(byteArray);
	}
	
	static stringToBase64(str) {
		return Buffer.from(str).toString('base64');
	}
	
	
	static base64ToString(str) {
		return Buffer.from(str, 'base64').toString('utf8');
	}
	
	
	static base58ToString(data) {
		const decoded = base58.decode(data);
		return this.byteArrayToString(decoded);
	}
	
	
	broadcast() {
		const options = {
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json;charset=UTF-8'
			},
			method: 'POST',
			body: JSON.stringify(this.tx)
		};
		return fetch(`${constants.TESTNET_NODES_BASE_URL}/transactions/broadcast`, options);
	}
}

export default DataTransaction;