'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.defaultAnalysis = defaultAnalysis;

var _simpleStatistics = require('simple-statistics');

var ss = _interopRequireWildcard(_simpleStatistics);

var _confidenceIntervals = require('../lib/confidenceIntervals');

var ci = _interopRequireWildcard(_confidenceIntervals);

var _twoSetsTests = require('../lib/twoSetsTests');

var twoSetsTests = _interopRequireWildcard(_twoSetsTests);

var _anova = require('../lib/anova');

var anova = _interopRequireWildcard(_anova);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

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

function defaultAnalysis(experimentObj) {
    var response = experimentObj.responses[0]; //.find((defResponse) => {return defResponse.name === experimentObj.meta.defaultResponse});
    var y = response.array;
    var n = y.length;
    var confLevel = experimentObj.meta.defaultConfLevel;
    var res = {};
    switch (experimentObj.meta.defaultAnalysis) {
        case 'descriptive':
            switch (response.nature) {
                case 'normal':
                    res.mean = ss.mean(y);
                    res.standardDeviation = ss.standardDeviation(y);
                    res.quantiles = ss.quantile(y, [0, 0.05, 0.25, 0.5, 0.75, 0.95, 1]);
                    res.skewness = ss.sampleSkewness(y);
                    res.standardError = res.standardDeviation / Math.sqrt(n);
                    res.meanConfInterval = ci.confidenceIntervalForT(res.mean, res.standardError, n - 1, confLevel);
                    res.varConfInterval = ci.confidenceIntervalForChi(ss.variance(y), n - 1, confLevel);

                    break;
                case 'binomial':
                    var successes = ss.sum(y); //assuming only binary values on the array
                    res.mean = successes; //also estimate of p
                    res.pEstimate = successes / n;
                    res.standardDeviation = Math.sqrt(n * res.pEstimate * (1 - res.pEstimate));
                    res.pConfInterval = ci.confidenceIntervalForBinomial(successes, n, confLevel);
                    break;
                case 'poisson':
                    break;
                default:
            }
            break;
        case 'comparative':
            //
            var factor = experimentObj.factors[0]; //the first factor is the main factor
            var entities = [].concat(_toConsumableArray(new Set(factor.array))); //extract the unique elements
            var nBlocks = experimentObj.blocks.length;
            // check overall consistence: array.lenght of response, factor and block should agree
            // unilevels.length should be equal to entities.length and larger than 2
            if (entities.length === 2) {
                if (nBlocks === 0) {
                    //unpaired test
                    var baseSet = y.filter(function (item, index) {
                        return factor.array[index] === entities[0];
                    });
                    var testSet = y.filter(function (item, index) {
                        return factor.array[index] === entities[1];
                    });
                    res = twoSetsTests.tTest(baseSet, testSet, confLevel);
                } else {
                    //paired test
                    var baseSet = y.filter(function (item, index) {
                        return factor.array[index] === entities[0];
                    });
                    var testSet = y.filter(function (item, index) {
                        return factor.array[index] === entities[1];
                    });
                    var sortedBaseSet = new Array(baseSet.length);
                    var sortedTestSet = new Array(testSet.length);
                    var block = experimentObj.blocks[0];
                    var nBS = 0;
                    var nTS = 0;
                    for (var index = 0; index < block.array.length; index++) {
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
                    var blocksArrays = new Array(nBlocks);
                    for (var index = 0; index < nBlocks; index++) {
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