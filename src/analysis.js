'use strict'
import * as ss from 'simple-statistics';
import * as ci from '../lib/confidenceIntervals';
import * as twoSetsTests from '../lib/twoSetsTests';
import * as anova from '../lib/anova';
/*
const defaultNormalDescription = {
    'mean': 0,
    'standardDeviation': 0,
    'standardError': 0,
    'quantiles': [0, 0 , 0, 0, 0, 0 , 0],//[min, 5%, 25, 50%, 75%, 95%, max]
    'confLevel': 0.95,
    'meanConfInterval': [0, 0],
    'varConfInterval': [0, 0],
    'comment': ''
}

const defaultBonomialDescription = {
    'proportion': 0,
    'standardDeviation': 0,
    'standardError': 0,
    'quantiles': [0, 0 , 0, 0, 0, 0 , 0],//[min, 5%, 25, 50%, 75%, 95%, max]
    'confLevel': 0.95,
    'confidenceInterval': [0, 0],
    'comment': ''
}*/

export function defaultAnalysis(experimentObj) {
    const response = experimentObj.responses[0];//.find((defResponse) => {return defResponse.name === experimentObj.meta.defaultResponse});
    const y = response.array;
    const n = y.length;
    const confLevel = experimentObj.meta.defaultConfLevel;
    let res = {};
    switch(experimentObj.meta.defaultAnalysis) {
        case 'descriptive':
            switch(response.nature) {
                case 'normal':
                    res.mean = ss.mean(y);
                    res.standardDeviation = ss.standardDeviation(y);
                    res.quantiles = ss.quantile(y, [0, 0.05, 0.25, 0.5, 0.75, 0.95, 1]);
                    res.skewness = ss.sampleSkewness(y);
                    res.standardError = res.standardDeviation / Math.sqrt(n);
                    res.meanConfInterval  = ci.confidenceIntervalForT(res.mean, res.standardError, n - 1, confLevel);
                    res.varConfInterval = ci.confidenceIntervalForChi(ss.variance(y), n - 1, confLevel);  
                    
                    break;
                case 'binomial':
                    const successes = ss.sum(y);//assuming only binary values on the array
                    res.mean = successes;//also estimate of p
                    res.pEstimate = successes / n;
                    res.standardDeviation = Math.sqrt(n * res.pEstimate * (1 - res.pEstimate));
                    res.pConfInterval  = ci.confidenceIntervalForBinomial(successes, n, confLevel);                    
                    break;
                case 'poisson':
                    break;
                default:                
            }
            break;
        case 'comparative':
            // 
            const factor = experimentObj.factors[0]; //the first factor is the main factor
            const entities = [...new Set(factor.array)]; //extract the unique elements
            const nBlocks = experimentObj.blocks.length;                 
            // check overall consistence: array.lenght of response, factor and block should agree
            // unilevels.length should be equal to entities.length and larger than 2
            if (entities.length === 2) {
                if (nBlocks === 0) {
                    //unpaired test
                    const baseSet = y.filter((item, index) => { return factor.array[index] === entities[0]; });
                    const testSet = y.filter((item, index) => { return factor.array[index] === entities[1]; });
                    res = twoSetsTests.tTest(baseSet, testSet, confLevel); 
                } else {
                    //paired test
                    const baseSet = y.filter((item, index) => { return factor.array[index] === entities[0]; });
                    const testSet = y.filter((item, index) => { return factor.array[index] === entities[1]; });
                    let sortedBaseSet = new Array(baseSet.length);
                    let sortedTestSet = new Array(testSet.length);
                    const block = experimentObj.blocks[0];    
                    let nBS = 0;  
                    let nTS = 0;             
                    for (let index = 0; index < block.array.length; index ++) {
                        if (factor.array[index] === entities[0]) {
                            sortedBaseSet[nBS] = baseSet[block.array[index]];
                            nBS++;
                        } else {
                            sortedTestSet[nTS] = testSet[block.array[index]];
                            nTS++;
                        }
                    }
                    res = twoSetsTests.tTestPaired(sortedBaseSet, sortedTestSet, confLevel); 
                } 
            } else {
                if (nBlocks === 0) {
                    //one way anova
                    res = anova.oneWay(y, factor.array);
                } else {
                    //n-way anova
                    let blocksArrays = new Array(nBlocks);
                    for (let index = 0; index < nBlocks; index++) {
                        blocksArrays[index] = experimentObj.blocks[index].array;
                    }
                    res = anova.nWay(y, factor.array, blocksArrays);
                }
            }
            break;
        default:                
    }
    experimentObj.meta.state = 'analyzed';
    return res;
}   
/*
if (response.nature === 'normal') {
    if (experimentObj.meta.defaultStat === 'mean') {                    
        res.confidenceInterval  = ci.confidenceIntervalForT(res.standardError, n - 1, confLevel);
        let delta = res.confidenceInterval[1] - res.confidenceInterval[0];
        res.comment = `Experiment response ${response.name} has a mean of ${res.mean} +/- ${delta} ${response.unit} with a confidence of ${confLevel*100}%`;
        return res; 
    } else if (experimentObj.meta.defaultStat === 'standardDeviation') {
        res.confidenceInterval = ci.confidenceIntervalForChi(ss.variance(y), n - 1, confLevel);
    }
}
*/

