import PrideToContract from './PrideToContract'


class PrideParser {

    constructor(data) {
        if (data.content) {
            this.prideContent = data.content;
        } else if (data.url) {
            //TODO: add url support
        }
        this.prideDefinition = JSON.parse(this.inlineVariables());
        this.prideDefinition = this.inlineConditions();
        if (data.debug) {
            console.log(this.prideDefinition);
        }
    }

    static escapeRegExp(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
    }


    inlineVariables() {
        let contract = JSON.stringify(this.prideContent);
        this.prideContent.variables.forEach((variable) => {
            const fullRef = PrideParser.escapeRegExp(`variables\('${variable.key}'\)`);
            const shortRef = PrideParser.escapeRegExp(`var:\('${variable.key}'\)`);
            const fullRegExp = new RegExp(fullRef, 'igm');
            contract = contract.replace(fullRegExp, variable.value);
            const shortRegExp = new RegExp(shortRef, 'igm');
            contract = contract.replace(shortRegExp, variable.value);
        });
        return contract;
    };

    inlineConditions() {
        const regExp = /conditions\('(.*?)'\)/gmi;
        const definitionCopy = Object.assign({}, this.prideDefinition);
        definitionCopy.states.forEach((state, stateIndex) => {

            state.transitions.forEach((transition, transitionIndex) => {
                let _when = [];
                transition.when.forEach((rule) => {
                    // already inlined
                    if (typeof rule === 'object') {
                        _when.push(rule);
                        return true;
                    }

                    console.log('WhenStatementCondition:', rule);

                    // inline condition('*')
                    let matches;
                    let conditionExpanded = false;
                    while ((matches = regExp.exec(rule)) !== null) {
                        const conditionName = matches[1];
                        console.log('ConditionName:', conditionName);
                        definitionCopy.conditions.forEach(condition => {
                            if (condition.name === conditionName){
                                _when.push(condition);
                                conditionExpanded = true;
                                return false
                            }
                        });
                    }

                    // throw an error if not object of function call
                    if (conditionExpanded) return true;
                    throw new Error('Condition is not recognized: ' + JSON.stringify(rule));
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

        const prideToContract = new PrideToContract(this.prideDefinition);
        return prideToContract.generateContract();
    }

}


export default PrideParser;