window.TX_EXAMPLES = {
    TRANSFER: {
        // An arbitrary address; mine, in this example
        recipient: '3PMgh8ra7v9USWUJxUCxKQKr6PM3MgqNVR8',
        // ID of a token, or WAVES
        assetId: 'WAVES',
        // The real amount is the given number divided by 10^(precision of the token)
        amount: 10000000,
        // The same rules for these two fields
        feeAssetId: 'WAVES',
        fee: 100000,
        // 140 bytes of data (it's allowed to use Uint8Array here)
        attachment: '',
        timestamp: Date.now()
    },
    ISSUE: {
        name: 'Your token name',
        description: 'Some words about it',
        // With given options you'll have 100000.00000 tokens
        quantity: 10000000000,
        precision: 5,
        // This flag defines whether additional emission is possible
        reissuable: false,
        fee: 100000000,
        timestamp: Date.now()
    },
    REISSUE: {
        // Asset ID which is to be additionnaly emitted
        assetId: '5xN8XPkKi7RoYUAT5hNKC26FKCcX6Rj6epASpgFEYZss',
        // Additional quantity is the given number divided by 10^(precision of the token)
        quantity: 100000000,
        reissuable: false,
        fee: 100000000,
        timestamp: Date.now()
    },
    BURN: {
        // Asset ID and its quantity to be burned
        assetId: '5xN8XPkKi7RoYUAT5hNKC26FKCcX6Rj6epASpgFEYZss',
        quantity: 20000000000,
        
        fee: 100000,
        timestamp: Date.now()
    },
    LEASE: {
        recipient: '5xN8XPkKi7RoYUAT5hNKC26FKCcX6Rj6epASpgFEYZss',
        
        // Both amount and fee may be presented as divided by 10^8 (8 is Waves precision)
        amount: 1000000000, // 10 Waves
        fee: 100000, // 0.001 Waves
        
        timestamp: Date.now()
    },
    CANCEL_LEASING: {
        // Related Lease transaction ID
        transactionId: '2kPvxtAit2nsumxBL7xYjvaWYmvmMfDL5oPgs4nZsHvZ',
        fee: 100000,
        timestamp: Date.now()
    },
    ALIAS: {
        // That's a kind of a nickname you attach to your address
        alias: 'xenohunter',
        fee: 100000,
        timestamp: Date.now()
    },
    DATA: {
        data: [
            {
                "key": "int",
                "type": "integer",
                "value": 24
            },
            {
                "key": "bool",
                "type": "boolean",
                "value": true
            },
            {
                "key": "blob",
                "type": "binary",
                "value": new Uint8Array([72, 101, 108, 108, 111, 32, 87, 111, 114, 108, 100, 33])
            },
            {
                "key": "My poem",
                "type": "string",
                "value": "Oh waves!"
            }
        
        ],
        fee: 100000,
        
    }
};


// const REQUEST_PARAMS = {
//     ISSUE: {
//         verson: 2,
//         type: 3,
//         name: "Test Asset 1",
//         description: "Some description",
//         sender: "3NBVqYXrapgJP9atQccdBPAgJPwHDKkh6A8",
//         senderPublicKey: "CRxqEuxhdZBEHX42MU4FfyJxuHmbDBTaHMhM3Uki7pLw",
//         quantity: 100000000000,
//         decimals: 8,
//         reissuable: true,
//         fee: 100000000,
//         timestamp: 1479287120875,
//         proofs: ["3cCKi3D17ysyEVg2cd3JGpCzm6ovL3HF8qDksX41oPLEqiRmMVZ2C8QJjs2Utd9YfQfzuEVRyzLsqPer89qAfo1A"]
//     },
//     TRANSFER: {
//         type: 4,
//         assetId: "E9yZC4cVhCDfbjFJCc9CqkAtkoFy5KaCe64iaxHM2adG",
//         senderPublicKey: "CRxqEuxhdZBEHX42MU4FfyJxuHmbDBTaHMhM3Uki7pLw",
//         recipient: "3Mx2afTZ2KbRrLNbytyzTtXukZvqEB8SkW7",
//         fee: 100000,
//         amount: 5500000000,
//         attachment: "BJa6cfyGUmzBFTj3vvvaew",
//         timestamp: 1479222433704,
//         proofs: ["3cCKi3D17ysyEVg2cd3JGpCzm6ovL3HF8qDksX41oPLEqiRmMVZ2C8QJjs2Utd9YfQfzuEVRyzLsqPer89qAfo1A"]
//     },
//     REISSUE: {
//         type: 5,
//         quantity: 22300000000,
//         assetId: "E9yZC4cVhCDfbjFJCc9CqkAtkoFy5KaCe64iaxHM2adG",
//         senderPublicKey: "CRxqEuxhdZBEHX42MU4FfyJxuHmbDBTaHMhM3Uki7pLw",
//         reissuable: true,
//         fee: 100000,
//         timestamp: 1479221697312,
//         proofs: ["3cCKi3D17ysyEVg2cd3JGpCzm6ovL3HF8qDksX41oPLEqiRmMVZ2C8QJjs2Utd9YfQfzuEVRyzLsqPer89qAfo1A"]
//     },
//     BURN: {
//         type: 6,
//         senderPublicKey: "EHDZiTW9uhZmpfKRyJtusHXCQ3ABwJ3t9dxZdiPp2GZC",
//         fee: 100000000,
//         timestamp: 1495623946088,
//         assetId: "AP5dp4LsmdU7dKHDcgm6kcWmeaqzWi2pXyemrn4yTzfo",
//         amount: 50000,
//         proofs: ["3cCKi3D17ysyEVg2cd3JGpCzm6ovL3HF8qDksX41oPLEqiRmMVZ2C8QJjs2Utd9YfQfzuEVRyzLsqPer89qAfo1A"]
//     },
//     LEASE: {
//         type: 8,
//         sender: "3HgqG68qfeVz5dqbyvqnxQceFaH49xmGvUS",
//         fee: 500000000,
//         amount: 500000000,
//         recipient: "address:3HQanDJhZSsSLbCjTCsMYpPvuj2ieGwKwQ9",
//         timestamp: 1495625416995,
//         proofs: ["3cCKi3D17ysyEVg2cd3JGpCzm6ovL3HF8qDksX41oPLEqiRmMVZ2C8QJjs2Utd9YfQfzuEVRyzLsqPer89qAfo1A"]
//     },
//     LEASE_CANCEL: {
//         type: 9,
//         senderPublicKey: "DddGQs63eWAA1G1ZJnJDVSrCpMS97NH4odnggwUV42kE",
//         fee: 500000000,
//         timestamp: 1495625418143,
//         txId: "CYPYhYe9M94t958Nsa3DcYNBZTURwcFgQ3ojyjwEeZiK",
//         proofs: ["3cCKi3D17ysyEVg2cd3JGpCzm6ovL3HF8qDksX41oPLEqiRmMVZ2C8QJjs2Utd9YfQfzuEVRyzLsqPer89qAfo1A"]
//     },
//     ALIAS: {
//         type: 10,
//         senderPublicKey: "CRxqEuxhdZBEHX42MU4FfyJxuHmbDBTaHMhM3Uki7pLw",
//         fee: 100000,
//         alias: "ALIAS",
//         timestamp: 1488807184731,
//         proofs: ["3cCKi3D17ysyEVg2cd3JGpCzm6ovL3HF8qDksX41oPLEqiRmMVZ2C8QJjs2Utd9YfQfzuEVRyzLsqPer89qAfo1A"]
//     },
//     DATA: {
//         type: 12,
//         senderPublicKey: "CRxqEuxhdZBEHX42MU4FfyJxuHmbDBTaHMhM3Uki7pLw",
//         fee: 100000,
//         alias: "ALIAS",
//         timestamp: 1488807184731,
//         proofs: ["3cCKi3D17ysyEVg2cd3JGpCzm6ovL3HF8qDksX41oPLEqiRmMVZ2C8QJjs2Utd9YfQfzuEVRyzLsqPer89qAfo1A"]
//     },
//     SET_SCRIPT: {
//         type: 13,
//         senderPublicKey: "CRxqEuxhdZBEHX42MU4FfyJxuHmbDBTaHMhM3Uki7pLw",
//         fee: 100000,
//         alias: "ALIAS",
//         timestamp: 1488807184731,
//         proofs: ["3cCKi3D17ysyEVg2cd3JGpCzm6ovL3HF8qDksX41oPLEqiRmMVZ2C8QJjs2Utd9YfQfzuEVRyzLsqPer89qAfo1A"]
//     },
//     SET_SPONSORSHIP: {
//         type: 14,
//         senderPublicKey: "CRxqEuxhdZBEHX42MU4FfyJxuHmbDBTaHMhM3Uki7pLw",
//         fee: 100000,
//         alias: "ALIAS",
//         timestamp: 1488807184731,
//         proofs: ["3cCKi3D17ysyEVg2cd3JGpCzm6ovL3HF8qDksX41oPLEqiRmMVZ2C8QJjs2Utd9YfQfzuEVRyzLsqPer89qAfo1A"]
//     },
// };