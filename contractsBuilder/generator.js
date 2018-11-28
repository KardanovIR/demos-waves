const fs = require('fs');
const PrideParser = require('./PrideParser');

const contractParser = new PrideParser({ filename: './contractFile.json', debug: true });
console.log(contractParser.generateContract());

// console.log(contractParser.getDefinition);