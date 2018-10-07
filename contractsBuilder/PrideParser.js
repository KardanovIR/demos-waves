const fs = require('fs');
const PrideGenerator = require('./PrideGenerator');


class PrideParser {
    
    // prideContent;
    // pridePlainText;
    // prideDefinition;
    
    constructor(data) {
        if (data.filename) {
            this.pridePlainText = fs.readFileSync(data.filename, { encoding: 'utf8' });
            this.prideContent = JSON.parse(this.pridePlainText);
        } else if (data.content) {
            this.prideContent = data.content;
        } else if (data.url) {
            //TODO: add url support
        }
        this.prideDefinition = JSON.parse(this.inlineVariables());
        this.prideDefinition = this.inlineConditions();
        if (data.debug) {
            fs.writeFile('debug.json', JSON.stringify(this.prideDefinition), 'utf8');
        }
    }
    
    static escapeRegExp(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
    }
    
    
    inlineVariables() {
        let contract = this.pridePlainText;
        this.prideContent.variables.forEach((variable) => {
            const escapedString = PrideParser.escapeRegExp(`variables\('${variable.key}'\)`);
            const regExp = new RegExp(escapedString, 'igm');
            contract = contract.replace(regExp, variable.value);
        });
        return contract;
    };
    
    inlineConditions() {
        const regExp = /conditions\('(.*?)'\)/gmi;
        const definitionCopy = Object.assign({}, this.prideDefinition);
        definitionCopy.states.forEach((state, stateIndex) => {
            
            state.transitions.forEach((transition, transitionIndex) => {
                let _when = [];
                transition.when.forEach((condition) => {
                    // already inlined
                    if (typeof condition === 'object') {
                        _when.push(condition);
                        return true;
                    }
                    
                    // inline condition('*')
                    let matches;
                    let conditionExpanded = false;
                    while ((matches = regExp.exec(condition)) !== null) {
                        const conditionName = matches[1];
                        _when.push(definitionCopy.conditions[conditionName]);
                        conditionExpanded = true;
                    }
                    
                    // throw an error if not object of function call
                    if (conditionExpanded) return true;
                    throw new Error('Condition is not recognized: ' + JSON.stringify(condition));
                });
                definitionCopy.states[stateIndex].transitions[transitionIndex].when = _when;
            });
        });
        return definitionCopy;
    }

// Getters list
    getPlainText() {
        return this.pridePlainText;
    }
    
    getDefinition() {
        return this.prideDefinition;
    }
    
    generateContract() {
        return new PrideGenerator(this.prideDefinition).generateContract();
    }
    
}


module.exports = PrideParser;