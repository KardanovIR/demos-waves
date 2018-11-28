class PrideGenerator {


    constructor(model, predefinedParts) {
        this.model = model;
        this.pride = predefinedParts;

    }


    createIdToStateMap = () => {
        return this.model.reduce((accumulator, current) => {
            accumulator[current.id] = current.value.label;
            return accumulator;
        }, {});
    };

    resolveTransitions = (states) => {
        const idToStateMap = this.createIdToStateMap();
        this.model.forEach(item => {
            if (item.edge !== 1 || !item.target) return;
            const fromStateName = idToStateMap[item.source];
            const toStateName = idToStateMap[item.target];
            const conditions = item.value.label.split(' && ');
            //find proper state with id
            states.forEach((state, index) => {
                if (item.source !== state.id) return;
                const transition = {
                    to: toStateName,
                    when: []
                };
                conditions.forEach(ruleName => {
                    if (ruleName !== ''){
                        transition.when.push(`conditions('${ruleName}')`);
                    }
                });
                state.transitions.push(transition);
                states[index] = state;
            });
        });
        return states;
    };

    getStates = () => {
        return this.model.map(item => {
            if (item.vertex === 1) {
                return {
                    name: item.value.label,
                    description: item.value.href,
                    transitions: [],
                    id: item.id
                }
            }
        }).filter(item => item !== undefined);
    };

    getJson = () => {
        this.pride.states = this.getStates();
        this.pride.states = this.resolveTransitions(this.pride.states);
        return this.pride;
    }
}

export default PrideGenerator;