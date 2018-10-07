const fs = require('fs');

class PrideGenerator {
    
    constructor(prideDefinition) {
        this.prideDefinition = prideDefinition;
    }
    
    generateConditionFor(when) {
        switch (when.type) {
            case 'publicKey': {
                return `sigVerify(tx.bodyBytes, tx.proofs[0], ${when.value})`;
            }
            case 'data': {
                if (typeof when.data.value === 'number') {
                    return `extract(getInteger(${when.address}, "${when.key}")) ${when.data.comparison} ${when.data.value}`
                } else {
                    return `extract(getString(${when.address}, "${when.key}")) = "${when.data.value}"`
                }
            }
            
        }
    }
    
    generateConditions() {
        const conditions = [];
        this.prideDefinition.states.forEach((state) => {
            state.transitions.forEach(transition => {
                const whenList = [];
                transition.when.forEach(when => {
                    whenList.push(this.generateConditionFor(when));
                });
                
                conditions.push(`if currentState == "${state.name}" && nextState == "${transition.to} "`)
            });
        });
    }
    
    generateContract() {
        
        const conditions = this.generateConditions();
        
        return `
let stateField = "${this.prideDefinition.key}"

match (tx) {
    case tx:DataTransaction =>
        
        let nextState = tx.data[0].value
        let currentState = getString(tx.sender, stateField)
        match (nextState) {
            case nextState:String =>
                currentStateValue = if(isDefined(currentState)) then extract(currentState) else false
                if (currentStateValue == false) then true
                else if currentState == "initial" && nextState == "" then true
                else if nextState == "dec" then true
                else throw("State change is not allowed")
            case _ => throw("State should be a string")
        }
    case _ => throw("Only data transactions are allowed")
}        `;
        
    }
    
}


module.exports = PrideGenerator;