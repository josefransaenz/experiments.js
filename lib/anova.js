'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.oneWay = oneWay;
exports.nWay = nWay;

var _simpleStatistics = require('simple-statistics');

var ss = _interopRequireWildcard(_simpleStatistics);

var _confidenceIntervals = require('../lib/confidenceIntervals');

var ci = _interopRequireWildcard(_confidenceIntervals);

var _distributions = require('distributions.js');

var dist = _interopRequireWildcard(_distributions);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

/**
 * Compare the means of three or more sets using one-way ANOVA
 * 
 * @param {Array} dataArray - array of all the observations 
 * @param {Array} factorArray - array with the values of the options for each data point 
 * @return {Object} {
        optionsSquaresSum,
        residualsSquaresSum,
        deviationsSquaresSum,
        optionsDegreesOfFreedom,
        residualsDegreesOfFreedom,
        deviationsDegreesOfFreedom,
        optionsMeanSquare,
        residualsMeanSquare,
        fStatistic,
        probabilityLevel
    }
*/
function oneWay(dataArray, factorArray) {
    if (dataArray.length !== factorArray.length) {
        throw 'the length of the dataArray and the factorArray should be equal';
    }
    var options = [].concat(_toConsumableArray(new Set(factorArray))); //extract the unique elements   
    var sets = new Array(options.length);

    var _loop = function _loop(index) {
        sets[index] = dataArray.filter(function (itemA, indexA) {
            return factorArray[indexA] === options[index];
        });
    };

    for (var index = 0; index < sets.length; index++) {
        _loop(index);
    }
    var grandMean = ss.mean(dataArray);
    var optionsMean = new Array(sets.length);
    var deviationsSquaresSum = 0;
    var optionsSquaresSum = 0;
    var residualsSquaresSum = 0;
    for (var index = 0; index < sets.length; index++) {
        optionsMean[index] = ss.mean(sets[index]);
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = sets[index][Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var item = _step.value;

                deviationsSquaresSum += Math.pow(item - grandMean, 2);
                optionsSquaresSum += Math.pow(optionsMean[index] - grandMean, 2);
                residualsSquaresSum += Math.pow(item - optionsMean[index], 2);
            }
        } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion && _iterator.return) {
                    _iterator.return();
                }
            } finally {
                if (_didIteratorError) {
                    throw _iteratorError;
                }
            }
        }
    }
    var deviationsDegreesOfFreedom = dataArray.length - 1;
    var optionsDegreesOfFreedom = sets.length - 1;
    var residualsDegreesOfFreedom = deviationsDegreesOfFreedom - optionsDegreesOfFreedom;
    var optionsMeanSquare = optionsSquaresSum / optionsDegreesOfFreedom;
    var residualsMeanSquare = residualsSquaresSum / residualsDegreesOfFreedom;
    var optionsFStatistic = optionsMeanSquare / residualsMeanSquare;
    var optionsProbabilityLevel = 1 - dist.fSnedecor(optionsFStatistic, optionsDegreesOfFreedom, residualsDegreesOfFreedom);
    return {
        optionsSquaresSum: optionsSquaresSum,
        residualsSquaresSum: residualsSquaresSum,
        deviationsSquaresSum: deviationsSquaresSum,
        optionsDegreesOfFreedom: optionsDegreesOfFreedom,
        residualsDegreesOfFreedom: residualsDegreesOfFreedom,
        deviationsDegreesOfFreedom: deviationsDegreesOfFreedom,
        optionsMeanSquare: optionsMeanSquare,
        residualsMeanSquare: residualsMeanSquare,
        optionsFStatistic: optionsFStatistic,
        optionsProbabilityLevel: optionsProbabilityLevel
    };
}

/**
 * Compare the means of three or more sets using N-way ANOVA
 * 
 * @param {Array} dataArray - array of all the observations 
 * @param {Array} factorArray - array with the values of the options for each data point 
 * @param {Array} blocks - array of arrays with the values of the blocks for each data point 
 * @return {Object} {
        optionsSquaresSum,
        residualsSquaresSum,
        blocksSquaresSums,
        deviationsSquaresSum,        
        optionsDegreesOfFreedom,
        residualsDegreesOfFreedom,
        blocksDegreesOfFreedom,
        deviationsDegreesOfFreedom,
        optionsMeanSquare,
        residualsMeanSquare,
        blocksMeansSquare,
        optionsFStatistic,
        blocksFStatistics,
        optionsProbabilityLevel,
        blocksProbabilityLevels
    }
*/

function nWay(responseArray, factorArray, blocks) {
    var deviationsDegreesOfFreedom = responseArray.length - 1;
    // Extracting the list of factor levels or options to compare
    var optionsList = [].concat(_toConsumableArray(new Set(factorArray))); //extract the unique elements
    var optionsDegreesOfFreedom = optionsList.length - 1;
    // Extracting the list of blocks and block levels
    var blockLevels = new Array(blocks.length);
    var blocksMeans = new Array(blocks.length);
    var blocksCounts = new Array(blocks.length);
    var blocksDegreesOfFreedom = new Array(blocks.length);
    var residualsDegreesOfFreedom = deviationsDegreesOfFreedom - optionsDegreesOfFreedom;
    for (var blockIndex = 0; blockIndex < blocks.length; blockIndex++) {
        blockLevels[blockIndex] = [].concat(_toConsumableArray(new Set(blocks[blockIndex]))); //extract the unique elements
        blocksMeans[blockIndex] = new Array(blockLevels[blockIndex].length);
        blocksMeans[blockIndex].fill(0);
        blocksCounts[blockIndex] = new Array(blockLevels[blockIndex].length);
        blocksCounts[blockIndex].fill(0);
        blocksDegreesOfFreedom[blockIndex] = blockLevels[blockIndex].length - 1;
        residualsDegreesOfFreedom -= blocksDegreesOfFreedom[blockIndex];
    }
    // Grand average
    var grandMean = ss.mean(responseArray);
    // Calculating the option sum and the blocks sum
    var optionsMean = new Array(optionsList.length);
    optionsMean.fill(0);
    var optionsCount = new Array(optionsList.length);
    optionsCount.fill(0);
    for (var index = 0; index < responseArray.length; index++) {
        optionsMean[factorArray[index]] += responseArray[index];
        optionsCount[factorArray[index]]++;
        for (var blockIndex = 0; blockIndex < blocks.length; blockIndex++) {
            blocksMeans[blockIndex][blocks[blockIndex][index]] += responseArray[index];
            blocksCounts[blockIndex][blocks[blockIndex][index]]++;
        }
    }
    // Calculating the option average as sum/counter
    for (var optionIndex = 0; optionIndex < optionsList.length; optionIndex++) {
        optionsMean[optionIndex] /= optionsCount[optionIndex];
    }
    // Calculating the blocks averages as sum/counter
    for (var blockIndex = 0; blockIndex < blocks.length; blockIndex++) {
        for (var blockLevelIndex = 0; blockLevelIndex < blockLevels[blockIndex].length; blockLevelIndex++) {
            blocksMeans[blockIndex][blockLevelIndex] /= blocksCounts[blockIndex][blockLevelIndex];
        }
    }
    // Calculating the Sums of Squares
    var deviationsSquaresSum = 0;
    var optionsSquaresSum = 0;
    var blocksSquaresSums = new Array(blocks.length);
    blocksSquaresSums.fill(0);
    var residualsSquaresSum = 0;
    for (var index = 0; index < responseArray.length; index++) {
        // Y = D - grandMean = O + Sum(B[i]) + R
        var y = responseArray[index];
        var d = y - grandMean;
        var o = optionsMean[factorArray[index]] - grandMean;
        var r = d - o; // R = D - O - Sum(B[i])
        deviationsSquaresSum += Math.pow(d, 2);
        optionsSquaresSum += Math.pow(o, 2);
        for (var blockIndex = 0; blockIndex < blocks.length; blockIndex++) {
            var b = blocksMeans[blockIndex][blocks[blockIndex][index]] - grandMean;
            blocksSquaresSums[blockIndex] += Math.pow(b, 2);
            r -= b;
        }
        residualsSquaresSum += Math.pow(r, 2);
    }
    // Calculating the Means Square and F-Statistics
    var optionsMeanSquare = optionsSquaresSum / optionsDegreesOfFreedom;
    var residualsMeanSquare = residualsSquaresSum / residualsDegreesOfFreedom;
    var optionsFStatistic = optionsMeanSquare / residualsMeanSquare;
    var blocksMeansSquare = new Array(blocks.length);
    var blocksFStatistics = new Array(blocks.length);
    var blocksProbabilityLevels = new Array(blocks.length);
    for (var blockIndex = 0; blockIndex < blocks.length; blockIndex++) {
        blocksMeansSquare[blockIndex] = blocksSquaresSums[blockIndex] / blocksDegreesOfFreedom[blockIndex];
        blocksFStatistics[blockIndex] = blocksMeansSquare[blockIndex] / residualsMeanSquare;
        blocksProbabilityLevels[blockIndex] = 1 - dist.fSnedecor(blocksFStatistics[blockIndex], blocksDegreesOfFreedom[blockIndex], residualsDegreesOfFreedom);
    }
    //Calculating probability levels
    var optionsProbabilityLevel = 1 - dist.fSnedecor(optionsFStatistic, optionsDegreesOfFreedom, residualsDegreesOfFreedom);
    return {
        optionsSquaresSum: optionsSquaresSum,
        residualsSquaresSum: residualsSquaresSum,
        blocksSquaresSums: blocksSquaresSums,
        deviationsSquaresSum: deviationsSquaresSum,
        optionsDegreesOfFreedom: optionsDegreesOfFreedom,
        residualsDegreesOfFreedom: residualsDegreesOfFreedom,
        blocksDegreesOfFreedom: blocksDegreesOfFreedom,
        deviationsDegreesOfFreedom: deviationsDegreesOfFreedom,
        optionsMeanSquare: optionsMeanSquare,
        residualsMeanSquare: residualsMeanSquare,
        blocksMeansSquare: blocksMeansSquare,
        optionsFStatistic: optionsFStatistic,
        blocksFStatistics: blocksFStatistics,
        optionsProbabilityLevel: optionsProbabilityLevel,
        blocksProbabilityLevels: blocksProbabilityLevels
    };
}