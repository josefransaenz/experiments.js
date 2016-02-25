'use strict'
import * as analysis from '../lib/analysis'

// Default objects
const defaultMeta = {
    "state": "empty",
    "comment": "",
    "defaultResponse": "",
    "defaultStat": "mean",
    "defaultAnalysis": "descriptive"
};
const defaultParameters = new Map();
const defaultResponses = [{
    "name": "",
    "nature": "normal",
    "unit": "",
    "array": [],
    "timeUnit": "order",
    "timeArray": [],
    "factors": [""],
    "blocks": [""]
}];
const defaultFactors = [{
    "name": "",
    "nature": "numeric",
    "unitLevels": "",
    "array": [],
    "isUncontrollable": true
}];
const defaultBlocks = [{
    "name": "",
    "nature": "categorical",
    "unitLevels": "",
    "array": []
}];
    
/** Class representing a generic experiment. */
//export default 
export class Experiment {
    constructor(experimentData) {//{comment = '', parameters = {}, responses = {}, factors = {}} = {}) {
        let data = experimentData || {};
        this.meta = data.meta || defaultMeta;
        this.parameters = new Map(data.parameters) || defaultParameters;
        this.responses = data.responses || defaultResponses;
        this.factors = data.factors || defaultFactors; 
        this.blocks = data.blocks || defaultBlocks;
        this.results = data.results || {};   
    }
    updateState() {
        if (this.meta.defaultResponse === '') {
            this.meta.state = 'empty';
            return this.meta.state;
        } 
    }
   defaultAnalysis() {
       let err = '';
       this.updateState();
       if (this.meta.state !== 'completed') {
           err = 'experiment not completed';
           console.error(err);
           return err;
       }
       this.results = analysis.defaultAnalysis(this); 
       return this.results;
   } 
}
/*
let dataNature = {
    NORMAL: 0,
    QUASI_NORMAL: 1,
    NON_NORMAL: 2,
    BINOMIAL: 3,
    POISSON: 4     
}

class ExperimentalData {
    constructor(name, nature, unit, array) {//{name = '', nature = 0, unit = undefined, array = []} = {}) {
        this.name = name;
        this.nature = nature;
        this.unit = unit;
        this.array = array;
    }
}

export class Response extends ExperimentalData {
    constructor(name, nature, unit, array, mainStat) {//{name = '', nature = 0, unit = undefined, array = [], mainStat = 0} = {}) {
        super(name, nature, unit, array);
        this.mainStat = mainStat;
    }
}

export class Factor extends ExperimentalData {
    constructor(name, nature, unit, array, isNoise, linkedResponses) {//{name = '', nature = 0, unit = undefined, array = [], mainStat = 0} = {}) {
        super(name, nature, unit, array);
        this.isNoise = isNoise;
        this.linkedResponses = linkedResponses;
    }
}
*/

