class PrideToContract {

    constructor(prideDefinition) {
        this.prideDefinition = prideDefinition;
    }

    generateConditionFor(when) {
        switch (when.type) {
            case 'One signature': {
                return `sigVerify(tx.bodyBytes, tx.proofs[0], base58'${when.value}')`;
            }
            case 'Multiple signatures': {
                const sigChecks = [];
                console.log(when);
                when.values.forEach((pk, index) => {
                    if (pk === undefined || pk === null || pk === '') return;
                    sigChecks.push(`sigVerify(tx.bodyBytes, tx.proofs[${index}], base58'${pk}')`);
                });
                return (sigChecks.length > 0 ? sigChecks.join(' && ') : 'true');
            }
            case 'Oracle data': {
                if (typeof when.data.value === 'number' && ['<', '>', '==', '>=', '<='].indexOf(when.data.comparison) !== -1) {
                    return `extract(getInteger(addressFromString("${when.address}"), "${when.key}")) ${when.data.comparison} ${when.data.value}`
                } else {
                    return `extract(getString(extract(addressFromString("${when.address}")), "${when.key}")) == "${when.data.value}"`
                }
            }
        }
    }

    generateConditions() {
        const conditions = [];
        this.prideDefinition.states.forEach((state) => {
            const rulesMap = state.transitions.map(transition => {
                const whenList = [];
                transition.when.forEach(when => {
                    whenList.push(`(${this.generateConditionFor(when)})`);
                });
                let parts = [`(nxt == "${transition.to}")`, `${whenList.length > 0 ? whenList.join(' && ') : 'true'}`];
                return `( ${parts.join(' && ')} )`;
            }).join(' || ');
            let oneStateConditions = `
\t\t\t\t\tif currentStateValue == "${state.name}" then { 
\t\t\t\t\t\t${rulesMap === '' ? 'false' : rulesMap}
\t\t\t\t\t}`;
            conditions.push(oneStateConditions);
        });
        return conditions.join(' else ');
    }

    generateContract() {

        const conditions = this.generateConditions();

        return `
let stateField = "${this.prideDefinition.key}"

match (tx) {
\tcase t:DataTransaction =>
        
\t\tlet newState = getString(t.data, stateField)
\t\tlet currentState = getString(tx.sender, stateField)
\t\tmatch (newState) {
\t\t\tcase nxt:String => {
\t\t\t\tif(isDefined(currentState) == false) then {
\t\t\t\t\t# there is no state yet
\t\t\t\t\tnxt == "Init"
\t\t\t\t} else {
\t\t\t\t\tlet currentStateValue = extract(currentState)
\t\t\t\t\t${conditions} 
\t\t\t\t\t else false
\t\t\t\t}
\t\t\t}                
\t\t\tcase _ => throw("State should be a string")
\t\t}
\t\tcase _ => throw("Only data transactions are allowed")
}
`;

    }

}


export default PrideToContract;