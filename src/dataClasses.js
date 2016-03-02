'use strict'
import * as analysis from '../lib/analysis'

// Default objects
const defaultMeta = {
    state: "empty",
    comment: "",
    defaultStat: "mean",
    defaultAnalysis: "descriptive",
    defaultConfLevel: 0.95
};
const defaultResponse = {
    name: "",
    nature: "normal",
    unit: "",
    array: [],
    timeUnit: "order",
    timeArray: [],
    factors: [],
    blocks: []
};
const defaultFactor = {
    name: "",
    nature: "numeric",
    unitLevels: [],
    array: [],
    isUncontrollable: true
};
const defaultBlock = {
    name: "",
    nature: "categorical",
    unitLevels: [],
    array: []
};

/** Valid experiment states */
const validStates = ['empty', 'defined', 'designed', 'inProgress', 'completed', 'analized'];

/** Valid data natures */
const validNatures = ['normal', 'non-normal', 'binomial', 'poisson', 'categorical'];
    
/** Class representing a generic experiment. */
//export default 
export class Experiment {
    constructor(experimentData) {//{comment = '', parameters = {}, responses = {}, factors = {}} = {}) {
        let data = experimentData || {};
        this.meta = data.meta || defaultMeta;
        this.parameters = new Map(data.parameters) || new Map();
        this.responses = data.responses || [];
        this.factors = data.factors || []; 
        this.blocks = data.blocks || [];
        this.results = data.results || {};   
    }
    updateState() {
        return this.meta.state;
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
   checkData() {
       let errors = []; 
       // Checks for empty objects      
       for (const key of Object.keys(defaultMeta)) {
           if (!this.meta.hasOwnProperty(key)) {
               errors.push(`Experiment object does not have meta property "${key}"`);
           }
       }
       // Checks for defined objects
       if (this.meta.state === validStates[0] || errors.length > 0) { return errors; }
       for (const response of this.responses) {
           for (const key of Object.keys(defaultResponse)) {
               if (!response.hasOwnProperty(key)) {
                   errors.push(`Experiment object does not have response property "${key}" on all responses`);
               }
           }
           if (response.hasOwnProperty('nature')) {
               if (validNatures.findIndex((item) => { return item === response.nature; }) < 0) {
                   errors.push(`Experiment object have an invalid response nature  "${response.nature}"`); 
               }
           }                     
       } 
       for (const factor of this.factors) {
           for (const key of Object.keys(defaultFactor)) {
               if (!factor.hasOwnProperty(key)) {
                   errors.push(`Experiment object does not have factor property "${key}" on all factors`);
               }
           }  
           if (factor.hasOwnProperty('nature')) {
               if (validNatures.findIndex((item) => { return item === factor.nature; }) < 0) {
                   errors.push(`Experiment object have an invalid factor nature  "${factor.nature}"`); 
               }
           }           
       } 
       for (const block of this.blocks) {
           for (const key of Object.keys(defaultBlock)) {
               if (!block.hasOwnProperty(key)) {
                   errors.push(`Experiment object does not have block property "${key}" on all blocks`);
               }
           } 
           if (block.hasOwnProperty('nature')) {
               if (validNatures.findIndex((item) => { return item === block.nature; }) < 0) {
                   errors.push(`Experiment object have an invalid block nature  "${block.nature}"`); 
               }
           }               
       }
       // Check for designed objects
       if (this.meta.state === validStates[1]  || errors.length > 0) { return errors; }
       /*for (const response of this.responses) {
           
       }*/
       for (const factor of this.factors) {
           if (factor.nature === 'categorical') {
               if (factor.unitLevels.length <= 1) {
                   errors.push(`Factor (${factor.name}) should have more than one category element`);
               } else if (factor.isUncontrollable === false) {
                   const levels = [...new Set(factor.array)]; //extract the unique elements
                   if (levels.length !== factor.unitLevels.length) {
                       errors.push(`All the categories of factor (${factor.name}) should be present in the factor array`);
                   } else {
                       let catCounts = new Array(levels.length);
                       catCounts.fill(0);
                       for (const item of factor.array) {
                           catCounts[item]++;
                       }
                       if ([...new Set(catCounts)].length > 1) {
                           errors.push(`The categories of factor (${factor.name}) should be repeated the same number of times (${catCounts})`);
                       }
                   }
               }
           }
       }
       for (const block of this.blocks) {
           if (block.nature === 'categorical') {
               if (block.unitLevels.length <= 1) {
                   errors.push(`Block (${block.name}) should have more than one category element`);
               } else {
                   const levels = [...new Set(block.array)]; //extract the unique elements
                   if (levels.length !== block.unitLevels.length) {
                       errors.push(`All the categories of block (${block.name}) should be present in the block array`);
                   } else {
                       let catCounts = new Array(levels.length);
                       catCounts.fill(0);
                       for (const item of block.array) {
                           catCounts[item]++;
                       }
                       if ([...new Set(catCounts)].length > 1) {
                           errors.push(`The categories of block (${block.name}) should be repeated the same number of times (${catCounts})`);
                       }
                   }
               }
           } else {
               errors.push(`Block (${block.name}) nature is not categorical`);
           }
       }
       // Check for inProgress objects
       if (this.meta.state === validStates[2]  || errors.length > 0) { return errors;}
       // Check for complete objects
       if (this.meta.state === validStates[3]  || errors.length > 0) { return errors; }
       for (const response of this.responses) {
           if (response.array.length !== response.timeArray.length) {
               errors.push(`Response array length is not equal to timeArray length`);
           }   
           for (const factorName of response.factors) {
               const relFactor = this.factors.find((f) => {return f.name === factorName});
               if (relFactor == undefined) {
                   errors.push(`Factor (${factorName}) of response (${response.name}) not found`);
               } else if (response.array.length !== relFactor.array.length) {
                   errors.push(`Factor (${factorName}) array length (${response.array.length}) is not equal to response array length (${relFactor.array.length})`);
               } 
           }    
           for (const blockName of response.blocks) {
               const relBlock = this.blocks.find((b) => {return b.name === blockName});               
               if (relBlock == undefined) {
                   errors.push(`Block (${blockName}) of response (${response.name}) not found`);
               } else if (response.array.length !== relBlock.array.length) {
                   errors.push(`Factor (${blockName}) array length (${response.array.length}) is not equal to response array length (${relBlock.array.length})`);
               }
           } 
       }
       /*
       for (const factor of this.factors) {
           
       }
       for (const block of this.blocks) {
           
       }
       */
       return errors;
   } 
}





